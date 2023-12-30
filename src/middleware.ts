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
  ignoredRoutes: ["/api/extension/updateUser", "/api/extension/addVacancy"],
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(redirectUrl);
    }

    // else if (auth.userId) {
    //   return NextResponse.redirect("/login");
    // }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
