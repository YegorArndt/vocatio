import { authMiddleware } from "@clerk/nextjs/server";
import { publicRoutes } from "./constants";

export default authMiddleware({
  publicRoutes,
  ignoredRoutes: ["/api/extension/updateUser"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
