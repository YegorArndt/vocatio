import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const { log } = console;

/**
 * Creation is handled via Nextjs API route.
 * And triggered by extension.
 */

export const vacanciesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action",
      });

    const user = await ctx.prisma.user.findUnique({
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

      const vacancy = await ctx.prisma.vacancy.findUnique({
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
