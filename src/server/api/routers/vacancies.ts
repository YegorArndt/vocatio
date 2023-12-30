import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const { log } = console;

/**
 * Creation is handled via Nextjs API route.
 * And triggered by extension.
 */
export const vacanciesRouter = createTRPCRouter({
  getByConstraint: publicProcedure
    .input(
      z.object({
        companyName: z.string(),
        location: z.string(),
        jobTitle: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { companyName, location, jobTitle } = input;

      const vacancies = await ctx.prisma.vacancy.findFirst({
        where: {
          companyName,
          location,
          jobTitle,
        },
      });

      return vacancies;
    }),

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

      /**
       * If vacancy is not connected to user, connect it.
       */
      if (!vacancy.userId) {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: {
            vacancies: {
              connect: {
                id: vacancy.id,
              },
            },
          },
        });
      }

      return vacancy;
    }),
});
