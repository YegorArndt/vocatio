// import type { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     try {
//       const { originalUrl, name, userId } = req.body;

//       // Validate the URL
//       if (!isValidUrl(originalUrl)) {
//         res.status(400).json({ error: "Invalid URL" });
//         return;
//       }

//       // Generate a short code
//       const shortUrl = generateShortCode();

//       // Save to the database
//       await prisma.url.create({
//         data: {
//           name,
//           originalUrl,
//           shortUrl,
//           userId,
//         },
//       });

//       // Respond with the short URL object
//       res.status(201).json({ originalUrl, shortUrl });
//     } catch (error) {
//       console.error("Error creating short URL:", error);
//       res.status(500).json({ error: "Error creating short URL" });
//     }
//   } else {
//     // Handle any non-POST requests
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// function isValidUrl(urlString: string): boolean {
//   try {
//     new URL(urlString);
//     return true;
//   } catch (_) {
//     return false;
//   }
// }

// // Helper function to generate a short code
// function generateShortCode(): string {
//   // Implement your logic to generate a unique short code
//   // Example: Generate a random string of 6 characters
//   return Math.random().toString(36).substring(2, 8);
// }
