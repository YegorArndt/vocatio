import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Configuration, OpenAIApi } from "openai";

// TODO take into account the fact that the user can also write texts for chatgpt. Might be a security issue.

const optimization =
  "Output one sentence stating the topic and the position assertion. Output one sentence stating the evidence and explanation.";

const getContent = (description: string, jobTitle: string) =>
  `Write a brief paragraph summarizing a significant contribution in your career as a ${jobTitle}, relevant to the requirements: ${description}. Your summary should:
- Contextualize your role and responsibilities in line with your experience level.
- Mention how you utilized the specified technology or method.
- Describe the positive outcome of your contribution on the business, such as process enhancements or customer engagement improvements.
Ensure the summary is realistic for the job title and within four sentences for conciseness.`;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getGptReply = async (content: string) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [{ role: "user", content }],
    temperature: 0.7,
  });

  return response?.data?.choices?.[0]?.message;
};

export const gptRouter = createTRPCRouter({
  getCompletion: publicProcedure
    .input(
      z.object({
        description: z.string(),
        jobTitle: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { description, jobTitle } = input;
      const gptReply = await getGptReply(getContent(description, jobTitle));

      if (!gptReply)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get completion from OpenAI.",
        });

      return gptReply;
    }),
});
