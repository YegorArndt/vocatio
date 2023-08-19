import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import fs from "fs";

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

  /**
   * Verify token
   */
  try {
    if (!publicKey) throw new Error("Public key not found");
    jwt.verify(token, publicKey);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(401).json({ message: (error as Err).message });
  }
}
