import { LiaMoneyCheckSolid } from "react-icons/lia";
import {
  Phone,
  Website,
  Linkedin,
  Github,
  Twitter,
  Vk,
  X,
  Glassdoor,
  Gmail,
  LinkedinColor,
  Diamond,
  Location,
  Email,
  Bird,
} from "./components/icons";

export const curEnv =
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.vocatio.cat") || "https://www.vocatio.cat";

export const publicRoutes = [
  "/privacy-policy",
  "/login",
  "/landing",
  "/api/extension/generateDraft",
  "/api/extension/addVacancy",
  "/extension-auth",
];

export const icons = {
  email: Email,
  phone: Phone,
  location: Location,
  website: Website,
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  vk: Vk,
  x: X,
  glassdoor: Glassdoor,
  gmail: Gmail,
  linkedinColor: LinkedinColor,
  diamond: Diamond,
  bird: Bird,
  check: LiaMoneyCheckSolid,
};

export const clerkAuth =
  "https://splendid-amoeba-59.accounts.dev/sign-in?redirect_url=https%3A%2F%2Fchirp-mu-rust-60.vercel.app%2Flogin#https://splendid-amoeba-59.accounts.dev/sign-in?redirect_url=https%3A%2F%2Fchirp-mu-rust-60.vercel.app%2Flogin";
