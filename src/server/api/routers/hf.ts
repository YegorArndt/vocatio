import { HfInference } from "@huggingface/inference";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const { log } = console;

const filterApiResponse = (response: string) => {
  // Define a regex for bullet points (dash or asterisk, text, followed by a dot)
  const bulletPointRegex = /[-*]\s[^-*]+\./g;

  // Extract all bullet points
  const bulletPoints = response.match(bulletPointRegex) || [];

  // Join the extracted bullet points
  const filteredResponse = bulletPoints.join("\n").trim();

  // Optional: Remove common closing phrases
  const closingPhraseRegex = /i hope this helps\.?$/i;
  return filteredResponse.replace(closingPhraseRegex, "").trim();
};

const inference = new HfInference(process.env.HF_API_KEY);

// const model = "gpt2";
// const model = "facebook/bart-large-cnn";
// const model = "google/flan-t5-base";
const model = "pszemraj/led-large-book-summary";

export const hfRouter = createTRPCRouter({
  condense: publicProcedure
    .input(
      z.object({
        text: z.string(),
        length: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { text, length: max_length = 100 } = input;

      const condensed = await inference.summarization({
        model: "sshleifer/distilbart-cnn-12-6",
        parameters: {
          max_length,
        },
        inputs: text,
      });

      if (!condensed)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get condensed.",
        });

      return condensed.summary_text;
    }),

  custom: publicProcedure
    .input(
      z.object({
        text: z.string(),
        userCommand: z.string().max(100).min(10),
      })
    )
    .mutation(async ({ input }) => {
      const { text, userCommand } = input;

      const inputs = `[INST] ${userCommand}. Avoid closing or opening phrases. Make these changes to this text: [/INST]": ${text}"`;

      const result = await inference.textGeneration({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        inputs,
      });

      if (!result)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get condensed.",
        });

      const cleaned = result.generated_text.replace(inputs, "").trim();

      return cleaned;
    }),

  convert: publicProcedure
    .input(
      z.object({
        text: z.string(),
        target: z.enum(["text", "bulletPoints"]),
      })
    )
    .mutation(async ({ input }) => {
      const { text, target } = input;

      const inputs =
        target === "bulletPoints"
          ? `[INST] You're need to convert the following text to bullet points. Avoid closing or opening phrases. Use past tense. [/INST]": ${text}"`
          : `[INST] You need to convert these bullet points to a compact text. Write in the first person. [/INST]": ${text.replaceAll(
              "-",
              "*"
            )}"`;

      const result = await inference.textGeneration({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        inputs,
      });

      if (!result)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get result.",
        });

      const cleaned = result.generated_text.replace(inputs, "").trim();

      return cleaned;
    }),
});
