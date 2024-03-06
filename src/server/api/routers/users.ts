import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getUserUpdateArgs } from "../utils/getUserUpdateArgs";
import { UserUpdateSchema } from "../utils/schemas";

const { log } = console;

const breakDownIntoBullets = () => {};

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

      // @ts-ignore
      const data = await getUserUpdateArgs(input, user);

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
});
