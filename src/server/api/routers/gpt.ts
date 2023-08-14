import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getGptReply = async (prompt: string) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [{ role: "user", content: prompt }],
  });

  return response?.data?.choices?.[0]?.message;
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

      const prompt = `Pretend to be an individual writing a cv text that describes their accomplishments and contributions during their time at a company (come up with a name). This CV will be sent to another company with the following requirements: ${requirements}. Make sure to return it in a form of an object that has the following shape: { description: (of what you did), companyName, jobTitle, period: (eg. March 2020 - August 2023) }.`;

      const gptReply = await getGptReply(prompt);

      if (!gptReply)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get completion from OpenAI.",
        });

      return gptReply;
    }),
});
