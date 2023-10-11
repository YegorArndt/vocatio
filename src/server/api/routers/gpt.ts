import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Configuration, OpenAIApi } from "openai";

// TODO take into account the fact that the user can also write texts for chatgpt. Might be a security issue.

const getContent = (
  description: string
) => `Given the requirements and objectives of a software company specializing in web application development for the banking sector, please generate a timeline text that outlines the professional contributions made during employment at the company. The text should mention:
1. Projects led or participated in
2. Technologies used
3. Very short about impact on the company in terms of team collaboration, customer satisfaction, client retention, process optimization, and decision-making insights.

The requirements for the company are ${description}.

Please use max. 1000 symbols and follow the example structure: "During my tenure at the company, I led and participated in the development of several high-impact projects..."
`;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getGptReply = async (description: string) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [{ role: "user", content: getContent(description) }],
    temperature: 0.7,
  });

  return response?.data?.choices?.[0]?.message;
};

export const gptRouter = createTRPCRouter({
  getCompletion: publicProcedure
    .input(
      z.object({
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { description } = input;
      const gptReply = await getGptReply(description);

      if (!gptReply)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get completion from OpenAI.",
        });

      return gptReply;
    }),
});
