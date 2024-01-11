import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const { log } = console;

export const draftsRouter = createTRPCRouter({
  // create: publicProcedure
  //   .input(
  //     z.object({
  //       vacancyId: z.string(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const { userId } = ctx;

  //     if (!userId)
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         message: "You are not authorized to perform this action",
  //       });

  //     const { vacancyId } = input;

  //     const [user, vacancy] = await ctx.prisma.$transaction([
  //       ctx.prisma.user.findFirst({
  //         where: { id: userId },
  //         include: { employmentHistory: true, skills: true },
  //       }),
  //       ctx.prisma.vacancy.findFirst({
  //         where: { id: vacancyId },
  //       }),
  //     ]);

  //     if (!user || !vacancy)
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "User or vacancy not found",
  //       });

  //     const tailored = await generateDraft(vacancy, user as PartialUser);

  //     const draft = await ctx.prisma.draft.create({
  //       data: {
  //         professionalSummary: tailored.professionalSummary,
  //         jobTitle: vacancy.jobTitle!,
  //         vacancyId: vacancy.id,
  //         topSkills: tailored.topSkills,
  //         employmentHistory: {
  //           create: tailored.employmentHistory,
  //         },
  //       },
  //     });

  //     return draft;
  //   }),

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

      const draft = await ctx.prisma.draft.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          employmentHistory: true,
          vacancy: true,
        },
      });

      if (!draft)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Draft not found",
        });

      return draft;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action",
      });

    const drafts = await ctx.prisma.draft.findMany({
      where: { userId },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return drafts;
  }),

  getByVacancyId: publicProcedure
    .input(
      z.object({
        vacancyId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });

      const { vacancyId } = input;

      const draft = await ctx.prisma.draft.findFirst({
        where: {
          userId,
          vacancyId,
        },
        include: {
          employmentHistory: true,
        },
      });

      if (!draft)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Draft not found",
        });

      return draft;
    }),
});
