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
  } = input;

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
          data: education,
        },
      },
    }),
    ...(experience && {
      experience: {
        deleteMany: {},
        createMany: {
          data: experience,
        },
      },
    }),
  } as Prisma.UserUpdateArgs["data"];

  return userUpdateArgs;
};
