import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const cvsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action",
      });

    const cvs = await ctx.prisma.cv.findMany({
      where: { userId },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return cvs;
  }),

  getByVacancyId: publicProcedure
    .input(
      z.object({
        vacancyId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { vacancyId } = input;

      const vacancy = await ctx.prisma.vacancy.findUnique({
        where: { id: vacancyId },
        include: { cvs: true },
      });

      return vacancy?.cvs ?? [];
    }),
});
