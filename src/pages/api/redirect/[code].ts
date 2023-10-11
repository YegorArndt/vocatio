import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const { code } = req.query;

  try {
    const url = await prisma.url.findUnique({
      where: {
        shortCode: code,
      },
    });

    if (url) {
      return res.redirect(301, url.original);
    } else {
      return res.status(404).json({ error: "Short URL not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
