import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

const schema = z.object({
  id: z.string(),
  name: z.string(),
  sections: z.record(z.any()),
  intrinsic: z.record(z.any()),
  a4: z.string(),
  font: z.string(),
  image: z.string(),
  pokemonImage: z.string(),
});

export const cvsRouter = createTRPCRouter({
  create: privateProcedure.input(schema).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create a user record",
      });
    }

    const newCv = await ctx.prisma.cv.upsert({
      where: {
        id: input.id,
      },
      update: {
        ...input,
      },
      create: {
        ...input,
        userId,
      },
    });

    return newCv;
  }),
});
