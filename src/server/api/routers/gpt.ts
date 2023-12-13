import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const applyGpt = async (content: string) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [{ role: "user", content }],
    temperature: 0.7,
    max_tokens: 300,
  });

  return response?.data?.choices?.[0]?.message;
};

export const gptRouter = createTRPCRouter({
  enhance: publicProcedure
    .input(
      z.object({
        vacancyId: z.string(),
        // employmentHistoryDescription: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { vacancyId } = input;

      if (!vacancyId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing vacancyId.",
        });

      const user = await ctx.prisma.user.findUnique({
        where: { id: "user_2ZEYNMvmeOEDARE0SSqtQnPvi6h" },
        include: { employmentHistory: true },
      });
      const first = user?.objective;

      const vacancy = await ctx.prisma.vacancy.findUnique({
        where: { id: vacancyId },
      });

      const content = `Adjust this objective ${first} to this vacancy ${vacancy?.description}`;
      const enhanced = await applyGpt(content);

      if (!enhanced)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get completion from OpenAI.",
        });

      return enhanced;
    }),
});
