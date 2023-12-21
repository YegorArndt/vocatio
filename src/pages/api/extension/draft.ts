import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { DraftEmploymentHistoryEntry, PrismaClient } from "@prisma/client";
import { HfInference } from "@huggingface/inference";
import jwt from "jsonwebtoken";
import { pick, shuffle } from "lodash-es";
import { VacancyDto } from "~/modules/extension/types";

const fs = require("fs");

const { log } = console;

//TODO: different openai requests for different available subsets of user data.
// they might have only a professional summary for example, or only employment histories...
type RequestBody = {
  vacancy: VacancyDto;
  userId: string;
  shouldGenerateDraft: boolean;
};

export const getSkillsOverlap = (
  vacancyDescription: string,
  skillsArray: string[]
): string[] => {
  const lowerCaseDescription = vacancyDescription.toLowerCase();

  // Determine the maximum number of skills to match
  const maxSkills = skillsArray.length > 8 ? 8 : skillsArray.length;

  // Helper function to check if a skill is an exact match.
  const isExactMatch = (skill: string, description: string) =>
    description.includes(skill.toLowerCase().trim());

  // Helper function to check if a skill is a partial match.
  const isPartialMatch = (skill: string, description: string) =>
    skill
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .some((word) => description.includes(word));

  // Find exact matches first.
  const exactMatches = skillsArray.filter((skill) =>
    isExactMatch(skill, lowerCaseDescription)
  );

  // Find partial matches, excluding the exact matches.
  const partialMatches = skillsArray.filter(
    (skill) =>
      isPartialMatch(skill, lowerCaseDescription) &&
      !exactMatches.includes(skill)
  );

  // Combine exact and partial matches.
  const combinedMatches = new Set([...exactMatches, ...partialMatches]);

  // Shuffle and fill the array if there are less than maxSkills.
  if (combinedMatches.size < maxSkills) {
    const shuffledSkills = shuffle(skillsArray);
    for (const skill of shuffledSkills) {
      if (!combinedMatches.has(skill)) {
        combinedMatches.add(skill);
        if (combinedMatches.size === maxSkills) break;
      }
    }
  }

  return Array.from(combinedMatches);
};

const extractEnhanced = (enhancedContent: string | undefined) => {
  if (!enhancedContent) return { successfullyEnhanced: false };

  // Remove "Summary:" and "Employment Histories:" from content
  enhancedContent = enhancedContent.replace(
    /Professional Summary:|Summary:|Employment Histories:/g,
    ""
  );

  // Split the response into summary and histories
  const [summary, historiesContent] = enhancedContent.split(/(?=@0)/, 2);

  if (!summary || !historiesContent) return { successfullyEnhanced: false };

  // Extract employment histories into an object
  const histories = {} as Record<string, string>;
  const historyRegex = /@(\d+): ([\s\S]*?)(?=@\d+:|$)/g;
  let match;

  while ((match = historyRegex.exec(historiesContent)) !== null) {
    const historyIndex = match[1] as string;
    const historyText = match[2]!.trim();
    histories[historyIndex] = historyText;
  }

  return { summary: summary.trim(), histories, successfullyEnhanced: true };
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
    model: "gpt-3.5-turbo",
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
     * Otherwise create both Vacancy and Draft.
     */
    const newVacancy = await prisma.vacancy.create({
      data: {
        ...vacancy,
        users: {
          connect: [{ id: userId }],
        },
      },
    });

    /**
     * Use OS-HF AI to generate vacancy summary.
     */
    const { summary_text: vacancySummary } = await inference.summarization({
      model: "sshleifer/distilbart-cnn-12-6",
      inputs: `Vacancy description: ${vacancy.description}. Vacancy requirements: ${vacancy.requiredSkills}.`,
    });

    await prisma.vacancy.update({
      where: { id: newVacancy.id },
      data: { summary: vacancySummary },
    });

    if (!shouldGenerateDraft)
      return res.status(200).json({ message: "Vacancy added" });

    /**
     * 2. Create Draft.
     */
    const professionalSummary = user.professionalSummary || "";
    const employmentHistories = user.employmentHistory.map(
      (x, i) => `@${i}: ${x.descriptionSummary}`
    );
    const messages: ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content: `You apply for job. Revise your professional summary & employment histories for job application.
          Summary:
          ${professionalSummary}

          Employment Histories:
          ${employmentHistories.join("\n")}

          Job to apply for:
            Company Name: ${vacancy.companyName}.
            Job title: ${vacancy.jobTitle}.
            Job requirements: ${vacancy.requiredSkills || vacancySummary}
      
            Task: identify keywords, skills, phrases & technologies from job requirements.
            Reword summary to include those. Reword histories making educated assumptions on when relevant skill or technology could've been used. Prefix histories with "@" and its number. 
          `,
      },
    ];

    const enhanced = await applyGpt(messages);

    const {
      summary: enhancedSummary = professionalSummary,
      histories,
      successfullyEnhanced,
    } = extractEnhanced(enhanced?.content);

    let draftEntries: Partial<DraftEmploymentHistoryEntry>[] =
      user.employmentHistory.map((entry) => {
        const skills = getSkillsOverlap(vacancy.description, entry.skills);

        return {
          ...pick(entry, ["period", "place", "title", "image"]),
          originalEmploymentHistoryEntryId: entry.id,
          skills,
        };
      });

    if (successfullyEnhanced) {
      draftEntries = draftEntries.map((entry, index) => {
        const matchFromEnhanced =
          histories![index.toString() as keyof typeof histories];

        return {
          ...entry,
          description: matchFromEnhanced || entry.description,
        };
      });
    }

    await prisma.draft.create({
      data: {
        professionalSummary: enhancedSummary,
        jobTitle: vacancy.jobTitle,
        userId,
        vacancyId: newVacancy.id,
        employmentHistory: {
          create: draftEntries as DraftEmploymentHistoryEntry[],
        },
      },
    });

    return res.status(200).json({ message: "Draft created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}
