import { z } from "zod";
import type { Prisma } from "@prisma/client";

import { UserUpdateSchema } from "./schemas";

const { log } = console;

export const getUserUpdateArgs = async (
  input: z.infer<typeof UserUpdateSchema>,
  prevUser: z.infer<typeof UserUpdateSchema>
) => {
  const {
    education,
    experience,
    contact,
    languages,
    skills,
    name,
    jobTitle,
    professionalSummary,
    linkedinId,
    email,
    image,
    defaultModel,
  } = input;

  let experienceWithoutBullets;

  if (experience) {
    experienceWithoutBullets = experience?.map((exp) => {
      const { bullets: b, ...rest } = exp;
      return rest;
    });
  }

  const userUpdateArgs = {
    ...(contact && {
      contact: {
        deleteMany: {},
        createMany: {
          data: contact,
        },
      },
    }),
    name,
    jobTitle,
    image,
    professionalSummary,
    linkedinId,
    defaultModel,
    email: email || prevUser.email,

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
          data: experienceWithoutBullets,
        },
      },
    }),
  } as Prisma.UserUpdateArgs["data"];

  return userUpdateArgs;
};
