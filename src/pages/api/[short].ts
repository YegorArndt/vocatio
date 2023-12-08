import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { shortCode } = req.query;

  try {
    const url = await prisma.url.findFirst({
      where: {
        shortUrl: shortCode as string,
      },
    });

    if (url) {
      res.redirect(url.originalUrl);
    } else {
      res.status(404).json({ error: "Short URL not found" });
    }
  } catch (error) {
    console.error("Error redirecting to URL:", error);
    res.status(500).json({ error: "Error redirecting to URL" });
  }
}
