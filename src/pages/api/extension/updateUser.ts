import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const fs = require("fs");

import { getUserUpdateArgs } from "~/server/api/utils/updateUser";
import { RouterOutputs } from "~/utils/api";

const { log } = console;

type Err = {
  name: string;
  message: string;
};

const prisma = new PrismaClient();
const publicKey = fs.readFileSync("secret/public.pem", "utf8");

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
      user: RouterOutputs["users"]["get"];
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: getUserUpdateArgs(user),
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({
      message: (error as Err).message,
      error: (error as Err).message,
    });
  }
}
