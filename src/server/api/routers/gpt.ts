import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Configuration, OpenAIApi } from "openai";

// TODO take into account the fact that the user can also write texts for chatgpt. Might be a security issue.

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getGptReply = async (prompt: string) => {
  const response = await openai.createCompletion({
    model: "gpt-3.5-turbo-16k",
    prompt,
  });

  return response?.data?.choices?.[0]?.text;
};

export const gptRouter = createTRPCRouter({
  getCompletion: publicProcedure
    .input(
      z.object({
        requirements: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { requirements } = input;
      const prompt = `Pretend to be an individual writing a cv text that describes their accomplishments and contributions during their time at a company (come up with a name). This CV will be sent to another company that currently hires for the following requirements: ${requirements}. Make sure to return it in a form of JSON that has the following shape: { "description": (imaginary description), "companyName" (imaginary company name), "jobTitle", "period" (imaginary period) }.`;
      const gptReply = await getGptReply(prompt);

      if (!gptReply)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get completion from OpenAI.",
        });

      return gptReply;
    }),
});
