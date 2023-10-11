import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  if (req.method === "POST") {
    const { original } = req.body;

    const shortCode = Math.random().toString(36).substring(2, 6);
    const newUrl = await prisma.url.create({
      data: {
        original,
        shortCode,
      },
    });

    res.json(newUrl);
  } else {
    res.status(405).end();
  }
}
