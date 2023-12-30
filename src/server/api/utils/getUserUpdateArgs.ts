import { z } from "zod";
import { EmploymentHistoryEntry, type Prisma } from "@prisma/client";
import { UserUpdateSchema } from "./schemas";
import { summarize, toBulletPoints } from "./ai";

const { log } = console;

const getDescriptionSummary = async (description: string) => {
  const { summary_text } = await summarize(description);
  const bullets = await toBulletPoints(summary_text);
  return bullets;
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
    image,
  } = input;
  const summarizedEmploymentHistory: EmploymentHistoryEntry[] = [];

  /**
   * Summarize employment history descriptions.
   */
  if (employmentHistory && employmentHistory.length > 0) {
    const fullDescriptions = employmentHistory.map((x) => x.description);

    const descriptionSummaries = await Promise.allSettled(
      fullDescriptions.map((description) => getDescriptionSummary(description!))
    );

    employmentHistory.forEach((x, i) => {
      const withSummary = {
        ...x,
        descriptionSummary:
          descriptionSummaries[i]?.status === "fulfilled"
            ? (descriptionSummaries[i] as PromiseFulfilledResult<string>)?.value
            : x.descriptionSummary || x.description,
      } as EmploymentHistoryEntry;

      summarizedEmploymentHistory.push(withSummary);
    });
  }

  const userUpdateArgs = {
    contact: {
      update: contact ? contact : undefined,
    },
    name,
    jobTitle,
    image,
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
  } as Prisma.UserUpdateArgs["data"];

  return userUpdateArgs;
};
