import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

import { type VacancyDto } from "~/modules/extension/types";
import { summarize } from "~/server/api/utils/ai";

const { log } = console;

type RequestBody = {
  vacancy: VacancyDto;
  userId: string;
};

/**
 * Add Vacancy public api.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(405).send({ message: "Only POST requests allowed" });

    const { vacancy, userId } = req.body as RequestBody;

    if (!userId) return res.status(400).json({ message: "Not authorized" });
    const { summary_text } = await summarize(vacancy.description);

    /**
     * Create a new vacancy.
     */
    await prisma.vacancy.create({
      data: {
        ...vacancy,
        summary: summary_text,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(200).json({ message: "Vacancy created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}
