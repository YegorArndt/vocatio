import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getUserUpdateArgs } from "../utils/updateUser";
import { UserUpdateSchema } from "../utils/schemas";

const { log } = console;

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

      const data = await getUserUpdateArgs(input);

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

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        education: true,
        employmentHistory: true,
        contact: true,
        languages: true,
        skills: true,
        recommendations: true,
        shortLinkedin: true,
        vacancies: true,
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
        name: z.string(),
        image: z.string(),
        contact: z.object({
          email: z.string(),
          phone: z.string().optional(),
        }),
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

      const { image, name, contact } = input;

      const newUser = await ctx.prisma.user.create({
        data: {
          id: userId,
          name,
          image,
          contact: {
            create: contact,
          },
        },
      });

      return newUser;
    }),

  getByVacancyId: publicProcedure
    .input(
      z.object({
        vacancyId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { vacancyId } = input;

      const vacancy = await ctx.prisma.vacancy.findUnique({
        where: {
          id: vacancyId,
        },
        include: {
          users: true,
        },
      });

      if (!vacancy) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Vacancy does not exist",
        });
      }

      const user = vacancy.users.find((user) => user.id === userId);

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist",
        });
      }

      return user;
    }),

  exists: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return Boolean(user);
    }),
});
