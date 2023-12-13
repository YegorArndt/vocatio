import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Vacancy } from "@prisma/client";
import { HfInference } from "@huggingface/inference";
const fs = require("fs");

type RequestBody = {
  vacancy: Vacancy;
  userId: string;
  shouldGenerateDraft: boolean;
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

    // if (!publicKey) throw new Error("Public key not found");
    /**
     * Verify token
     */
    // jwt.verify(token, publicKey);

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
    const objective = user.objective || "";
    const messages: ChatCompletionRequestMessage[] = [
      {
        role: "user",
        content: `Revise my professional summary for a job application, keeping it personalized and concise.

        Original Summary:
        ${objective}
        
        Job Details:
        
        Company Name: ${vacancy.companyName}.
        Job Title: ${vacancy.jobTitle}.
        Job Requirements: ${vacancy.requiredSkills}.
        Request:
        Adapt my summary to fit the job, addressing the company. Max 5 sentences, professional tone.`,
      },
    ];
    const enhancedObjective = await applyGpt(messages);

    await prisma.draft.create({
      data: {
        objective: enhancedObjective?.content ?? objective,
        jobTitle: vacancy.jobTitle,
        userId,
        vacancyId: newVacancy.id,
      },
    });

    return res.status(200).json({ message: "Draft created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}
