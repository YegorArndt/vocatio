import { z } from "zod";
import { HfInference } from "@huggingface/inference";
import { EmploymentHistoryEntry, type Prisma } from "@prisma/client";
import { UserUpdateSchema } from "./schemas";

const inference = new HfInference(process.env.HF_API_KEY);

const getDescriptionSummary = async (description: string) => {
  const res = await inference.summarization({
    model: "sshleifer/distilbart-cnn-12-6",
    inputs: description,
  });

  return res.summary_text;
};

export const getUserUpdateArgs = async (
  input: z.infer<typeof UserUpdateSchema>
) => {
  const {
    education,
    employmentHistory,
    contact,
    languages,
    skills,
    recommendations,
    name,
    jobTitle,
    professionalSummary,
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
    name,
    jobTitle,
    professionalSummary,
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
