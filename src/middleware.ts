import { authMiddleware } from "@clerk/nextjs/server";
import { publicRoutes } from "./constants";
import { NextResponse } from "next/server";

const redirectUrl =
  (process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_REDIRECT_URL_DEV
    : process.env.NEXT_PUBLIC_REDIRECT_URL_PROD) ||
  "https://vocatio-blzgp4ptp-yegorarndt-gmailcom.vercel.app/login";

export default authMiddleware({
  publicRoutes,
  ignoredRoutes: ["/api/extension/updateUser"],
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(
        "https://splendid-amoeba-59.accounts.dev/sign-in?redirect_url=https%3A%2F%2Fchirp-mu-rust-60.vercel.app%2Flogin"
      );
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
