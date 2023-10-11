import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const storySchema = z.object({
  order: z.number(),
  periodOfEmployment: z.string(),
  companyName: z.string(),
  jobTitle: z.string(),
  story: z.string(),
});

export const storiesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this page",
      });

    const stories = await ctx.prisma.story.findMany({
      where: { userId },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return stories;
  }),

  getById: publicProcedure
    .input(z.object({ storyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to view this page",
        });

      const { storyId } = input;

      const story = await ctx.prisma.story.findUnique({
        where: {
          id: storyId,
          userId,
        },
      });

      if (!story)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Story not found",
        });

      return story;
    }),

  create: publicProcedure
    .input(storySchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a story record",
        });
      }

      const story = await ctx.prisma.story.create({
        data: {
          ...input,
          userId,
        },
      });

      return story;
    }),

  createMany: publicProcedure
    .input(z.object({ stories: z.array(storySchema) }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a story record",
        });
      }

      const stories = await ctx.prisma.story.createMany({
        data: input.stories.map((story) => ({
          ...story,
          userId,
        })),
      });

      return stories;
    }),
});
