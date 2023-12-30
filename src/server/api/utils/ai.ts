import { HfInference, TextGenerationArgs } from "@huggingface/inference";
import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai";

export const inference = new HfInference(process.env.HF_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const hfFormat =
  'Avoid closing or opening phrases like "Here is the changed text". Do not return my text itself. Write in the first person';

export const clean = (text: string, patterns: string[]) =>
  patterns.reduce((acc, pattern) => acc.replace(pattern, "").trim(), text);

// check out possible length, sometimes need more
export const summarize = async (text: string, max_length?: number) =>
  await inference.summarization({
    model: "sshleifer/distilbart-cnn-12-6",
    parameters: {
      max_length,
    },
    inputs: text,
  });

export const instruct = async (
  inputs: string,
  parameters?: TextGenerationArgs["parameters"]
) =>
  await inference.textGeneration({
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    inputs,
    parameters,
  });

export const toBulletPoints = async (text: string) => {
  const inputs = `[INST] 
    Convert employment history to bullet points. 
    Conditions: Use past tense. Make it sound professional. ${hfFormat}.

    Employment history to convert:
    [/INST] "${text}"`;

  const converted = await instruct(inputs);

  if (!converted) throw new Error("Failed to get converted from OS-HF AI.");

  const cleaned = clean(converted.generated_text, [
    inputs,
    "Bullet points:",
    "Revised:",
    "Bullet point conversion:",
    "Converted bullet points:",
    "Converted employment history in bullet points:",
    "Converted to bullet points:",
    "Bullet point version:",
    "Revised as bullet points:",
  ]).replaceAll("*", "•");

  return cleaned;
};

export const applyGpt = async (messages: ChatCompletionRequestMessage[]) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages,
  });

  return response?.data?.choices?.[0]?.message?.content;
};
