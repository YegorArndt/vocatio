import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Configuration, OpenAIApi } from "openai";

const { log } = console;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const applyGpt = async (content: string) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [{ role: "user", content }],
  });

  return response?.data?.choices?.[0]?.message;
};

export const gptRouter = createTRPCRouter({
  adjust: publicProcedure
    .input(
      z.object({
        context: z.string(),
        textToAdjust: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { context, textToAdjust } = input;

      if (!context || !textToAdjust)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing arguments.",
        });

      const prompt = `Employment history: ${textToAdjust}. Required skills: ${context}. Rewrite employment history using key words from required skills. Ignore everything about education. Write in the first person. Avoid opening or closing phrases.`;

      const enhanced = await applyGpt(prompt);

      if (!enhanced)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get completion from OpenAI.",
        });

      return enhanced.content;
    }),
});
