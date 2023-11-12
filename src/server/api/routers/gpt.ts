import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Configuration, OpenAIApi } from "openai";
import { getRandomCompanyName } from "~/modules/create/utils";

// TODO take into account the fact that the user can also write texts for chatgpt. Might be a security issue.

const getContent = (description: string, jobTitle: string) => {
  const companyName = getRandomCompanyName();

  return {
    content: `Write a brief paragraph summarizing a significant contribution in your career as a ${jobTitle} at ${companyName}, relevant to the requirements: ${description}. Your summary should:
    - Contextualize your role and responsibilities in line with your experience level.
    - Mention how you utilized the specified technology or method.
    - Describe the positive outcome of your contribution on the business, such as process enhancements or customer engagement improvements.
    Ensure the summary is realistic for the job title and within four sentences for conciseness.`,
    companyName,
  };
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getGptReply = async (content: string) => {
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content }],
    temperature: 0.7,
  });

  return response?.data?.choices?.[0]?.message;
};

export const gptRouter = createTRPCRouter({
  getCompletion: publicProcedure
    .input(
      z.object({
        jobDescription: z.string(),
        jobTitle: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { jobDescription, jobTitle } = input;

      if (!jobDescription || !jobTitle)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing jobDescription or jobTitle.",
        });

      const content = getContent(jobDescription, jobTitle);

      const story = await getGptReply(content.content);

      if (!story)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get completion from OpenAI.",
        });

      return { story, companyName: content.companyName };
    }),
});
