import { HfInference } from "@huggingface/inference";
import { EmploymentHistoryEntry, Prisma } from "@prisma/client";
import { z } from "zod";
import { RouterOutputs } from "~/utils/api";

const inference = new HfInference(process.env.HF_API_KEY);

const getDescriptionSummary = async (description: string) => {
  const res = await inference.summarization({
    model: "sshleifer/distilbart-cnn-12-6",
    inputs: description,
  });

  return res.summary_text;
};

const SkillLevel = z.enum([
  "BASIC",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
  "NATIVE",
]);

const ProfessionField = z.enum([
  "FRONTEND",
  "BACKEND",
  "FULLSTACK",
  "SECURITY",
  "PROJECT_MANAGER",
  "PRODUCT_MANAGER",
  "DATA_SCIENTIST",
  "DEVOPS",
  "UI_UX_DESIGNER",
  "SYSTEM_ADMINISTRATOR",
  "DATABASE_ADMINISTRATOR",
  "MOBILE_DEVELOPER",
  "EMBEDDED_DEVELOPER",
  "QA",
  "NETWORK_ENGINEER",
  "CLOUD_ENGINEER",
  "MACHINE_LEARNING_ENGINEER",
  "ANALYST",
  "SCRUM_MASTER",
]);

const LanguageEntrySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  level: SkillLevel,
  userId: z.string(),
});

const SkillEntrySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  level: SkillLevel,
  userId: z.string(),
});

const EducationEntrySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  place: z.string(),
  period: z.string(),
  description: z.string(),
  image: z.string(),
  title: z.string(),
  userId: z.string().uuid(),
});

const EmploymentHistoryEntrySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
  place: z.string(),
  period: z.string(),
  description: z.string(),
  descriptionSummary: z.string(),
  skills: z.array(z.string()),
  image: z.string(),
  title: z.string(),
  userId: z.string().uuid(),
});

const ContactSchema = z.object({
  email: z.string(),
  phone: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  indeed: z.string().optional(),
  glassdoor: z.string().optional(),
  hh: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  skype: z.string().optional(),
  vk: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
});

const UserUpdateSchema = z
  .object({
    name: z.string(),
    image: z.string(),
    professionalSummary: z.string().optional(),

    jobTitle: z.string().optional(),
    professionField: ProfessionField.optional(),

    languages: z.array(LanguageEntrySchema),
    skills: z.array(SkillEntrySchema),
    education: z.array(EducationEntrySchema),
    employmentHistory: z.array(EmploymentHistoryEntrySchema),

    contact: ContactSchema,
  })
  .partial();

export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;

export const getUserUpdateArgs = async (
  input: RouterOutputs["users"]["get"]
) => {
  const {
    education,
    employmentHistory,
    contact,
    languages,
    skills,
    recommendations,
  } = input;
  const summarizedEmploymentHistory: EmploymentHistoryEntry[] = [];

  /**
   * Summarize employment history descriptions.
   */
  if (employmentHistory && employmentHistory.length > 0) {
    const fullDescriptions = employmentHistory.map((x) => x.description);

    const descriptionSummaries = await Promise.allSettled(
      fullDescriptions.map((description) => getDescriptionSummary(description))
    );

    employmentHistory.forEach((x, i) => {
      const withSummary: EmploymentHistoryEntry = {
        ...x,
        descriptionSummary:
          descriptionSummaries[i]?.status === "fulfilled"
            ? (descriptionSummaries[i] as PromiseFulfilledResult<string>)?.value
            : x.descriptionSummary || x.description,
      };

      summarizedEmploymentHistory.push(withSummary);
    });
  }

  const userUpdateArgs: Prisma.UserUpdateArgs["data"] = {
    contact: {
      update: contact ? contact : undefined,
    },
    ...(recommendations && {
      recommendations: {
        deleteMany: {},
        createMany: {
          data: recommendations,
        },
      },
    }),
    ...(skills && {
      skills: {
        deleteMany: {},
        createMany: {
          data: skills,
        },
      },
    }),
    ...(languages && {
      languages: {
        deleteMany: {},
        createMany: {
          data: languages,
        },
      },
    }),
    ...(education && {
      education: {
        deleteMany: {},
        createMany: {
          data: education,
        },
      },
    }),
    ...(summarizedEmploymentHistory.length && {
      employmentHistory: {
        deleteMany: {},
        createMany: {
          data: summarizedEmploymentHistory,
        },
      },
    }),
  };

  return userUpdateArgs;
};
