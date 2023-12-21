import type { NextApiRequest, NextApiResponse } from "next";
import {
  Contact,
  EmploymentHistoryEntry,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import jwt from "jsonwebtoken";
const fs = require("fs");

import type { User } from "~/modules/extension/types";
import { typedEntries } from "~/modules/draft/utils/common";
import { isNil } from "lodash-es";
import { HfInference } from "@huggingface/inference";

const { log } = console;

type Err = {
  name: string;
  message: string;
};

const entries = [
  "education",
  "recommendations",
  "certifications",
  "awards",
  "languages",
  "skills",
];

const prisma = new PrismaClient();
const publicKey = fs.readFileSync("secret/public.pem", "utf8");
const inference = new HfInference(process.env.HF_API_KEY);

const getDescriptionSummary = async (description: string) => {
  const res = await inference.summarization({
    model: "sshleifer/distilbart-cnn-12-6",
    inputs: description,
  });

  return res.summary_text;
};

export default async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || !publicKey)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    jwt.verify(token, publicKey);

    const { userId, user } = req.body as {
      userId: string;
      user: User;
    };

    const definedUser = {} as Prisma.UserUpdateArgs["data"];

    for (const [key, value] of typedEntries(user)) {
      if (key === "contact" && !isNil(value)) {
        definedUser.contact = {
          update: {
            linkedin: (value as Contact).linkedin,
          },
        };
      } else if (
        key === "employmentHistory" &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        const fullDescriptions = (value as User["employmentHistory"]).map(
          (x) => x.description
        );

        const descriptionSummaries = await Promise.allSettled(
          fullDescriptions.map((description) =>
            getDescriptionSummary(description)
          )
        );

        const data = (value as EmploymentHistoryEntry[]).map((x, i) => {
          const descriptionSummary =
            descriptionSummaries[i].status === "fulfilled"
              ? descriptionSummaries[i].value
              : x.description; // Fallback to the original description

          return {
            ...x,
            descriptionSummary,
          };
        });

        definedUser.employmentHistory = {
          deleteMany: {},
          createMany: { data },
        };
      } else if (entries.includes(key) && Array.isArray(value)) {
        definedUser[key] = {
          deleteMany: {},
          createMany: {
            data: value,
          },
        };
      } else if (value !== null && value !== undefined && value !== "") {
        definedUser[key] = value;
      }
    }

    log("definedUser", definedUser);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: definedUser,
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({
      message: (error as Err).message,
      error: (error as Err).message,
    });
  }
}
