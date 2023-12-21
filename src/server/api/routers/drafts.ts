import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const draftsRouter = createTRPCRouter({
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
