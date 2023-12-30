import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  clean,
  hfFormat,
  instruct,
  summarize,
  toBulletPoints,
} from "../utils/ai";
import { TextGenerationOutput } from "@huggingface/inference";

const { log } = console;

export const hfRouter = createTRPCRouter({
  condense: publicProcedure
    .input(
      z.object({
        text: z.string(),
        length: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { text, length: max_length = 100 } = input;

      const condensed = await summarize(text, max_length);

      if (!condensed)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get condensed.",
        });

      return condensed.summary_text;
    }),

  elaborate: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { text } = input;

      const inputs = `[INST] ${hfFormat}. Do not use numeration. Add 3 more contextually appropriate sentences to the text [/INST]:" ${text}"`;

      const elaborated = await instruct(inputs);

      if (!elaborated)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get elaborated.",
        });

      const cleaned = clean(elaborated.generated_text, [inputs]);
      return cleaned;
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

      const inputs = `[INST] ${hfFormat}. Make these changes "${userCommand}" to this text: [/INST]: "${text}"`;

      const custom = await instruct(inputs);

      if (!custom)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get custom.",
        });

      const cleaned = clean(custom.generated_text, [inputs]);

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

      const isText = target === "text";

      const textPrompt = `[INST] You need to convert these bullet points to a compact text. Write in the first person. [/INST]": ${text}"`;

      const converted = await (isText
        ? instruct(textPrompt)
        : toBulletPoints(text));

      if (!converted)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get converted.",
        });

      const result = (
        isText ? (converted as TextGenerationOutput).generated_text : converted
      ) as string;

      const cleaned = clean(result, [textPrompt]);

      return cleaned;
    }),
});
