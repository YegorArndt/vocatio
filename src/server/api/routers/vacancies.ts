import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { PartialVacancySchema } from "../utils/schemas";
import { Vacancy } from "@prisma/client";

const { log } = console;

export const vacanciesRouter = createTRPCRouter({
  create: publicProcedure
    .input(PartialVacancySchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });

      const createdVacancy = await ctx.prisma.vacancy.create({
        // @ts-ignore
        data: {
          ...input,
          userId,
        },
      });

      return createdVacancy;
    }),

  deleteForUser: publicProcedure
    .input(
      z.object({
        vacancyId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });

      const { vacancyId } = input;

      const deletedVacancy = await ctx.prisma.vacancy.update({
        where: { id: vacancyId },
        data: {
          user: {
            // @ts-ignore
            disconnect: { id: userId },
          },
        },
      });

      return deletedVacancy;
    }),

  upsert: publicProcedure
    .input(PartialVacancySchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId || !input.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });

      const upsertedVacancy = await ctx.prisma.vacancy.upsert({
        where: { id: input.id },
        update: input as Vacancy,
        // @ts-ignore
        create: {
          ...(input as Vacancy),
          user: {
            connect: { id: userId },
          },
        },
      });

      return upsertedVacancy;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action",
      });

    const user = await ctx.prisma.user.findFirst({
      where: { id: userId },
      include: {
        vacancies: {
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        },
      },
    });

    return user?.vacancies ?? [];
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });

      const { id } = input;

      const vacancy = await ctx.prisma.vacancy.findFirst({
        where: { id },
      });

      if (!vacancy)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vacancy not found",
        });

      return vacancy;
    }),
});
