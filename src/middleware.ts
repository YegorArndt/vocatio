import { authMiddleware } from "@clerk/nextjs/server";
import { publicRoutes } from "./constants";
import { NextResponse } from "next/server";

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
    // else if (auth.userId) {
    //   // handle authenticated users
    //   return NextResponse.redirect(
    //     "https://vocatio-blzgp4ptp-yegorarndt-gmailcom.vercel.app/vacancies"
    //   );
    // }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
