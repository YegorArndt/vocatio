import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

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
    const { data } = req.body;
    //log data type
    console.log(data);
    // await prisma.vacancy.create({ data });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(401).json({ message: (error as Err).message });
  }
}
