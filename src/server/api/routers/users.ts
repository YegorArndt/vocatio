import {
  Remote,
  Seniority,
  EmploymentType,
  ProfessionField,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this page",
      });

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
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
        ownName: z.string(),
        ownImage: z.string(),
        ownEmail: z.string(),
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

      const newUser = await ctx.prisma.user.create({
        data: {
          id: userId,
          ...input,
        },
      });

      return newUser;
    }),

  update: publicProcedure
    .input(
      z.object({
        ownName: z.string().optional(),
        ownImage: z.string().optional(),
        ownCountry: z.string().optional(),
        ownEmail: z.string(),
        linkedInUrl: z.string().optional(),
        indeedUrl: z.string().optional(),
        glassdoorUrl: z.string().optional(),
        hhUrl: z.string().optional(),
        ownCity: z.string().optional(),
        ownJobTitle: z.string().optional(),
        ownExperienceYears: z.number().optional(),
        ownObjective: z.string().optional(),
        desiredProfessionField: z.nativeEnum(ProfessionField).optional(),
        desiredRemote: z.nativeEnum(Remote).optional(),
        desiredSalaryMin: z.number().optional(),
        desiredSalaryMax: z.number().optional(),
        desiredSeniority: z.nativeEnum(Seniority).optional(),
        desiredEmploymentType: z.nativeEnum(EmploymentType).optional(),
      })
    )
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

      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: input,
      });

      return updatedUser;
    }),
});
