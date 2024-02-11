import { GrGraphQl } from "react-icons/gr";
import { LiaMoneyCheckSolid } from "react-icons/lia";
import { DiMysql, DiPostgresql, DiRedis, DiScrum } from "react-icons/di";
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
  SiEslint,
  SiJest,
  SiKubernetes,
  SiNestjs,
  SiNextdotjs,
  SiPrisma,
  SiReactquery,
  SiRedux,
  SiRuby,
  SiSvelte,
  SiTailwindcss,
  SiTestinglibrary,
  SiTrpc,
  SiTypescript,
  SiWebpack,
} from "react-icons/si";
import {
  FaAngular,
  FaAws,
  FaDocker,
  FaHtml5,
  FaJava,
  FaLaravel,
  FaLinux,
  FaNodeJs,
  FaNpm,
  FaReact,
  FaSass,
  FaVuejs,
} from "react-icons/fa";
import { BsFiletypeCss, BsFiletypeScss } from "react-icons/bs";
import { TbApi, TbBrandCypress, TbBrandVite, TbSql } from "react-icons/tb";
import { VscJson } from "react-icons/vsc";
import { IoColorPaletteOutline } from "react-icons/io5";

export const curEnv =
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.vocatio.cat") || "https://www.vocatio.cat";

export const publicRoutes = ["/privacy-policy", "/login", "/landing"];

// Exact means "==="
// Partial means "includes"

// dotnet is unique enough to be exact
// .net is not unique enough to be exact (kek.net would then be matched)

export const icons = [
  { partial: ["email"], icon: Email },
  { partial: ["phone"], icon: Phone },
  { partial: ["address", "location"], icon: Location },
  { exact: ["website"], icon: Website },
  { partial: ["linkedin"], icon: Linkedin },
  { partial: ["github"], icon: Github },
  { exact: ["twitter"], icon: Twitter },
  { exact: ["vk"], icon: Vk },
  { exact: ["x"], icon: X },
  { exact: ["glassdoor"], icon: Glassdoor },
  { exact: ["gmail"], icon: Gmail },
  { exact: ["linkedinColor"], icon: LinkedinColor },
  { exact: ["diamond"], icon: Diamond },
  { exact: ["bird"], icon: Bird },
  { exact: ["check"], icon: LiaMoneyCheckSolid },
  { exact: ["star"], icon: IoIosStarOutline },
  { partial: ["javascript"], exact: ["js"], icon: IoLogoJavascript },
  { partial: ["typescript"], exact: ["ts"], icon: SiTypescript },
  {
    exact: ["nodejs", "node.js"],
    partial: ["nodejs", "node.js"],
    icon: FaNodeJs,
  },
  { exact: ["react", "reactjs", "react.js"], icon: FaReact },
  { exact: ["laravel"], icon: FaLaravel },
  { exact: ["nextjs", "next.js"], icon: SiNextdotjs },
  { partial: ["tailwind", "tailwindcss", "tailwind css"], icon: SiTailwindcss },
  { partial: ["vue.js", "vue", "vuejs"], icon: FaVuejs },
  { partial: ["html5", "html"], icon: FaHtml5 },
  { partial: ["css3", "css"], icon: BsFiletypeCss },
  { partial: ["scss"], icon: BsFiletypeScss },
  { partial: ["RESTful APIs", "REST API"], icon: TbApi },
  { exact: ["json"], icon: VscJson },
  { partial: ["webpack"], icon: SiWebpack },
  { exact: ["design"], icon: IoColorPaletteOutline },
  { partial: ["mysql"], icon: DiMysql },
  { partial: ["postgres"], icon: DiPostgresql },
  { partial: ["sass"], icon: FaSass },
  { exact: [".net", "dotnet"], partial: ["dotnet"], icon: SiDotnet },
  { partial: ["c#"], icon: SiCsharp },
  { exact: ["cypress"], icon: TbBrandCypress },
  { partial: ["react testing library"], icon: SiTestinglibrary },
  { partial: ["redux", "redux toolkit"], icon: SiRedux },
  { partial: ["scrum"], icon: DiScrum },
  { partial: ["kubernetes"], icon: SiKubernetes },
  { partial: ["eslint"], icon: SiEslint },
  { partial: ["aws"], icon: FaAws },
  { partial: ["graphql"], icon: GrGraphQl },
  { partial: ["svelte"], icon: SiSvelte },
  { partial: ["trpc"], icon: SiTrpc },
  { partial: ["linux"], icon: FaLinux },
  { partial: ["docker"], icon: FaDocker },
  { exact: ["prisma", "prisma orm"], icon: SiPrisma },
  { exact: ["redis"], icon: DiRedis },
  { exact: ["npm"], icon: FaNpm },
  { exact: ["vite"], icon: TbBrandVite },
  { partial: ["ruby on rails"], icon: SiRuby },
  { partial: ["react query", "reactquery", "tanstack"], icon: SiReactquery },
  { partial: ["jest"], icon: SiJest },
  { exact: ["angular", "angular.js"], icon: FaAngular },
  { exact: ["nestjs", "nest.js"], icon: SiNestjs },
  { exact: ["sql"], icon: TbSql },
  { exact: ["java"], icon: FaJava },
];

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
