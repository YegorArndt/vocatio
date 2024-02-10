import { LiaMoneyCheckSolid } from "react-icons/lia";
import { DiMysql, DiPostgresql, DiScrum } from "react-icons/di";
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
import { BaseComponentType } from "./modules/create/design/types";
import { IoIosStarOutline, IoLogoJavascript } from "react-icons/io";
import {
  SiCsharp,
  SiDotnet,
  SiNextdotjs,
  SiRedux,
  SiTailwindcss,
  SiTestinglibrary,
  SiTypescript,
  SiWebpack,
} from "react-icons/si";
import {
  FaHtml5,
  FaLaravel,
  FaNodeJs,
  FaReact,
  FaSass,
  FaVuejs,
} from "react-icons/fa";
import { BsFiletypeCss, BsFiletypeScss } from "react-icons/bs";
import { TbApi, TbBrandCypress } from "react-icons/tb";
import { VscJson } from "react-icons/vsc";
import { IoColorPaletteOutline } from "react-icons/io5";

export const curEnv =
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.vocatio.cat") || "https://www.vocatio.cat";

export const publicRoutes = ["/privacy-policy", "/login", "/landing"];

export const icons = {
  email: Email,
  phone: Phone,
  address: Location,
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
  star: IoIosStarOutline,
  javascript: IoLogoJavascript,
  js: IoLogoJavascript,
  typescript: SiTypescript,
  "node.js": FaNodeJs,
  react: FaReact,
  laravel: FaLaravel,
  nextjs: SiNextdotjs,
  tailwind: SiTailwindcss,
  "vue.js": FaVuejs,
  html5: FaHtml5,
  css3: BsFiletypeCss,
  scss: BsFiletypeScss,
  "RESTful APIs": TbApi,
  "REST API": TbApi,
  json: VscJson,
  webpack: SiWebpack,
  design: IoColorPaletteOutline,
  mysql: DiMysql,
  postgres: DiPostgresql,
  sass: FaSass,
  ".net": SiDotnet,
  dotnet: SiDotnet,
  "c#": SiCsharp,
  cypress: TbBrandCypress,
  "react testing library": SiTestinglibrary,
  redux: SiRedux,
  "redux toolkit": SiRedux,
  scrum: DiScrum,
};

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
