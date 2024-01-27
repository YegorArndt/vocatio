import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getUserUpdateArgs } from "../utils/getUserUpdateArgs";
import { UserUpdateSchema } from "../utils/schemas";
import { ExperienceEntry, User } from "@prisma/client";
import { pick } from "lodash-es";
import { createShadowExperience } from "../utils/generate-cv/gpt";

const { log } = console;

const getShadowExperience = async (
  user: User & { experience: ExperienceEntry[] }
) => {
  const { experience } = user;
  const shadowExperience: ExperienceEntry[] = [];

  if (experience && experience.length > 0) {
    const shadowDescriptions = await createShadowExperience(experience);

    if (!shadowDescriptions["0"]) {
      log("Error: Shadow experience could not be generated.");
      return;
    }

    experience.forEach((x, i) => {
      const withShadowDescription = {
        ...pick(x, [
          "description",
          "title",
          "place",
          "period",
          "image",
          "skills",
        ]),
        shadowDescription: shadowDescriptions[i] || x.description,
      };

      shadowExperience.push(withShadowDescription as ExperienceEntry);
    });
  }

  return shadowExperience;
};

export const usersRouter = createTRPCRouter({
  update: publicProcedure
    .input(UserUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to update a user record",
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist",
        });
      }

      const data = await getUserUpdateArgs(
        input,
        user as z.infer<typeof UserUpdateSchema>
      );

      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data,
      });

      return updatedUser;
    }),

  get: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this page",
      });

    const user = await ctx.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        education: true,
        experience: true,
        contact: true,
        languages: true,
        skills: true,
        vacancies: {
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        },
      },
    });

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });

    return user;
  }),

  create: privateProcedure
    .input(
      /**
       * Use Clerk data
       */
      z.object({
        image: z.string(),
        name: z.string(),
        contact: z.array(z.object({ name: z.string(), value: z.string() })),
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a user record",
        });
      }

      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (existingUser) return existingUser;

      const { image, name, email, contact } = input;

      const newUser = await ctx.prisma.user.create({
        data: {
          id: userId,
          name,
          image,
          email,
          contact: {
            create: contact,
          },
        },
      });

      return newUser;
    }),

  createShadowExperience: publicProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create a user record",
      });
    }

    const existingUser = await ctx.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        experience: true,
      },
    });

    if (!existingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User does not exist",
      });
    }

    if (existingUser.experience.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No experience provided",
      });
    }

    if (existingUser.experience[0]?.shadowDescription) {
      return existingUser;
    }

    const shadowExperience = await getShadowExperience(existingUser);

    if (!shadowExperience) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Shadow experience could not be generated",
      });
    }

    const updatedUser = await ctx.prisma.user.update({
      where: { id: userId },
      data: {
        experience: {
          deleteMany: {},
          createMany: {
            data: shadowExperience,
          },
        },
      },
    });

    return updatedUser;
  }),
});
