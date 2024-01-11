import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { applyGpt } from "../utils/ai";

const { log } = console;

export const gptRouter = createTRPCRouter({
  adjust: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { prompt } = input;

      if (!prompt)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing prompt.",
        });

      const result = await applyGpt([
        {
          role: "system",
          content: prompt,
        },
      ]);

      if (!result)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get completion from OpenAI.",
        });

      return result;
    }),
});
