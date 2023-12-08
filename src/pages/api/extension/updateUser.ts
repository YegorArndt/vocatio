import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const fs = require("fs");

import type { User } from "~/modules/extension/types";

type Err = {
  name: string;
  message: string;
};

const entries = [
  "education",
  "employmentHistory",
  "recommendations",
  "certifications",
  "awards",
  "languages",
  "skills",
];

const prisma = new PrismaClient();
// const publicKey = process.env.JWT_PUBLIC_KEY;
const publicKey = fs.readFileSync("secret/public.pem", "utf8");

export default async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || !publicKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    jwt.verify(token, publicKey);

    const { userId, user } = req.body as {
      userId: string;
      user: User;
    };

    const definedUser = {};

    // as Prisma.UserUpdateArgs["data"];

    Object.entries(user).forEach(([key, value]) => {
      if (key === "contact") {
        definedUser[key] = {
          update: value,
        };
      }
      if (entries.includes(key) && Array.isArray(value)) {
        definedUser[key] = {
          deleteMany: {},
          createMany: {
            data: value,
          },
        };
      } else if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        key !== "contact"
      ) {
        definedUser[key] = value;
      }
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: definedUser,
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Err).message,
    });
  }
}
