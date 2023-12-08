import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import jwt from "jsonwebtoken";

const fs = require("fs");

// const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
const publicKey = fs.readFileSync("secret/public.pem", "utf8");

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  const sessToken = cookies.get("__session");
  const token = req.headers.authorization?.split(" ")[1];

  if (sessToken === undefined && token === undefined) {
    res.status(401).json({ error: "not signed in" });
    return;
  }

  try {
    let decoded;
    if (token) {
      decoded = jwt.verify(token, publicKey);
      res.status(200).json({ sessToken: decoded });
      return;
    } else {
      decoded = jwt.verify(sessToken, publicKey);
      res.status(200).json({ sessToken: decoded });
      return;
    }
  } catch (error) {
    res.status(400).json({
      error: "Invalid Token",
    });
    return;
  }
}
