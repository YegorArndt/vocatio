import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { type VacancyDto } from "~/modules/extension/types";

const { log } = console;

type RequestBody = {
  vacancy: VacancyDto;
};

const prisma = new PrismaClient();

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

    const { vacancy } = req.body as RequestBody;
    /**
     * Create a new vacancy.
     */
    await prisma.vacancy.create({
      data: vacancy,
    });

    res.status(200).json({ message: "Vacancy created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}
