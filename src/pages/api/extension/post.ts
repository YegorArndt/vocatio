import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

//https://clerk.com/docs/request-authentication/validate-session-tokens?utm_source=www.google.com&utm_medium=referral&utm_campaign=none

export default function (req: NextApiRequest, res: NextApiResponse) {
  const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;

  /**
   * You can extract the token from the request cookies or headers.
   */
  // const cookies = new Cookies(req, res);
  // const sessToken = cookies.get("__session"); // the same origin

  const token = req.headers.authorization; // the extension origin

  if (!token) {
    res.status(401).json({ error: "not signed in" });
    return;
  }

  try {
    if (token && publicKey) {
      const decoded = jwt.verify(token, publicKey);
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
