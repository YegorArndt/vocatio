import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import fs from "fs";
import { PrismaClient, Vacancy } from "@prisma/client";

const prisma = new PrismaClient();
const publicKey = fs.readFileSync("secret/public.pem", "utf8");

type Err = {
  name: string;
  message: string;
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    if (!publicKey) throw new Error("Public key not found");

    /**
     * Verify token
     */
    jwt.verify(token, publicKey);

    /**
     * Push to database
     */
    const { data: vacancyFromExtension } = req.body as {
      data: Vacancy;
    };

    /**
     * See if this vacancy has been added to the database before
     */
    const existingVacancy = await prisma.vacancy.findFirst({
      where: {
        companyName: vacancyFromExtension.companyName,
        jobTitle: vacancyFromExtension.jobTitle,
      },
    });

    if (existingVacancy) {
      /**
       * Update the number of applicants - this is the ~only thing that can change
       */
      await prisma.vacancy.update({
        where: { id: existingVacancy.id },
        data: {
          numApplicants: vacancyFromExtension.numApplicants,
        },
      });

      res.status(200).json({
        message:
          "The vacancy's already been scanned before. We'll update it anyway though.",
      });
    } else {
      /**
       * Create a new vacancy
       */
      const { userId, ...rest } = vacancyFromExtension;

      // await prisma.vacancy.create({
      //   data: {
      //     ...rest,
      //     user: {
      //       connect: {
      //         id: userId,
      //       },
      //     },
      //   },
      // });
      res.status(200).json({ message: "You can navigate back to the app!" });
    }
  } catch (error) {
    // res.status(401).json({ message: (error as Err).message });
    res.status(401).json({ message: "Kek" });
  }
}
