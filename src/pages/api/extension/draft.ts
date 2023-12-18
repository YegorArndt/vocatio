import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import {
  DraftEmploymentHistoryEntry,
  PrismaClient,
  Vacancy,
} from "@prisma/client";
import { HfInference } from "@huggingface/inference";
import jwt from "jsonwebtoken";
import { pick } from "lodash-es";

const fs = require("fs");

const { log } = console;

type RequestBody = {
  vacancy: Vacancy;
  userId: string;
  shouldGenerateDraft: boolean;
};

const extractEnhanced = (enhancedContent: string) => {
  if (!enhancedContent) return null;

  // Split the response into summary and histories
  const [summary, historiesContent] = enhancedContent.split(/(?=@0)/, 2);

  // Extract employment histories into an object
  const histories = {};
  const historyRegex = /@(\d+): ([\s\S]*?)(?=@\d+:|$)/g;
  let match;

  while ((match = historyRegex.exec(historiesContent)) !== null) {
    const historyIndex = match[1];
    const historyText = match[2].trim();
    histories[historyIndex] = historyText;
  }

  return { summary: summary.trim(), histories };
};

const publicKey = fs.readFileSync("secret/public.pem", "utf8");

const prisma = new PrismaClient();
const inference = new HfInference(process.env.HF_API_KEY);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const applyGpt = async (messages: ChatCompletionRequestMessage[]) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages,
  });

  return response?.data?.choices?.[0]?.message;
};

/**
 * Create Draft api.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    if (req.method !== "POST")
      return res.status(405).send({ message: "Only POST requests allowed" });

    if (!publicKey) throw new Error("Public key not found");
    /**
     * Verify token
     */
    jwt.verify(token, publicKey);

    const {
      vacancy,
      userId,
      shouldGenerateDraft = true,
    } = req.body as RequestBody;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { employmentHistory: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    /**
     * Create a new vacancy.
     */

    /**
     * 1. See if this vacancy has been added to the database before
     */
    const existingVacancy = await prisma.vacancy.findFirst({
      where: {
        companyName: vacancy.companyName,
        jobTitle: vacancy.jobTitle,
      },
    });

    /**
     * 2. If so, update the number of applicants - this is the ~only thing that can change
     */
    if (existingVacancy) {
      await prisma.vacancy.update({
        where: { id: existingVacancy.id },
        data: {
          numApplicants: vacancy.numApplicants,
        },
      });

      return res.status(200).json({
        message:
          "The vacancy's already been added before. We'll update it anyway though.",
      });
    }

    /**
     * Otherwise create a new vacancy and a Draft User Object for it.
     */

    /**
     * 1. Generate vacancy summary.
     */
    const { summary_text: summary } = await inference.summarization({
      model: "sshleifer/distilbart-cnn-12-6",
      inputs: `Vacancy description: ${vacancy.description}. Vacancy requirements: ${vacancy.requiredSkills}.`,
    });

    const newVacancy = await prisma.vacancy.create({
      data: {
        ...vacancy,
        summary,
        userId,
      },
    });

    if (!shouldGenerateDraft)
      return res.status(200).json({ message: "Vacancy added" });

    /**
     * 2. Create Draft User Object.
     */
    const professionalSummary = user.professionalSummary || "";
    const employmentHistories = user.employmentHistory.map(
      (x, i) => `@${i}: ${x.descriptionSummary}`
    );
    const messages: ChatCompletionRequestMessage[] = [
      {
        role: "user",
        content: `Revise my professional summary, and employment histories for a job application.

        Original Summary:
        ${professionalSummary}
        Employment Histories:
        ${employmentHistories}
        
        Job Details:
        Company Name: ${vacancy.companyName}.
        Job Title: ${vacancy.jobTitle}.
        Job Requirements: ${vacancy.requiredSkills}.

        Request:
        Adapt my summary to fit the job, addressing the company. Max 5 sentences for summary. Adapt my employment histories to fit the job. Prefix histories with "@" and its number. Keep professional tone.`,
      },
    ];
    const enhanced = await applyGpt(messages);
    const { summary: enhancedSummary = professionalSummary, histories } =
      extractEnhanced(enhanced?.content);

    log("mmm bitch", histories);

    const draftEmploymentHistoryEntry: Partial<DraftEmploymentHistoryEntry>[] =
      user.employmentHistory.map((entry, index) => {
        const matchFromEnhanced = histories[index];

        return {
          ...pick(entry, ["skills", "period", "place", "title", "image"]),
          originalEmploymentHistoryEntryId: entry.id,
          description: matchFromEnhanced || entry.description,
        };
      });

    await prisma.draft.create({
      data: {
        professionalSummary: enhancedSummary,
        jobTitle: vacancy.jobTitle,
        userId,
        vacancyId: newVacancy.id,
        draftEmploymentHistoryEntry: {
          create: draftEmploymentHistoryEntry,
        },
      },
    });

    return res.status(200).json({ message: "Draft created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}
