import { BaseComponentType } from "./create/design/types";

export const curEnv =
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.vocatio.cat") || "https://www.vocatio.cat";

export const extensionUrl =
  "https://chromewebstore.google.com/detail/vocatio/bknmlolcaccbfcedimgmpnfcjadfelbn";

export const clerkAuth =
  "https://splendid-amoeba-59.accounts.dev/sign-in?redirect_url=https%3A%2F%2Fchirp-mu-rust-60.vercel.app%2Flogin#https://splendid-amoeba-59.accounts.dev/sign-in?redirect_url=https%3A%2F%2Fchirp-mu-rust-60.vercel.app%2Flogin";

export const linkedinBaseUrl = "https://www.linkedin.com/in/";

export const linkedinJobsSearchUrl = "https://www.linkedin.com/jobs/search/?";

export const cvSections: BaseComponentType[] = [
  "contact",
  "education",
  "experience",
  "languages",
  "skills",
  "userImage",
];

export const BEFORE_RED = "bg-[#ffdce0] clr-black rounded-md p-3";
export const AFTER_GREEN = "bg-[#E7FFEB] clr-black rounded-md p-3";
