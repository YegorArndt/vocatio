import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const validateUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export const urlsRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      /**
       * Use Clerk data
       */
      z.object({
        name: z.string(),
        originalUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to view this page",
        });

      const { name, originalUrl } = input;

      if (!validateUrl(originalUrl))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid URL",
        });

      const shortUrl = generateShortCode();

      const shortened = await prisma.url.create({
        data: {
          name,
          originalUrl,
          shortUrl,
          userId,
        },
      });

      if (!shortened)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Short url could not be created",
        });

      return shortened;
    }),

  get: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this page",
      });

    const url = await ctx.prisma.url.findFirst({
      where: {
        userId,
      },
    });

    if (!url)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Url not found",
      });

    return url;
  }),
});
