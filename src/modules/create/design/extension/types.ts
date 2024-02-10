import type { Vacancy } from "@prisma/client";
import type { RouterOutputs } from "~/utils/api";

export enum ProfessionField {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
  FULLSTACK = "FULLSTACK",
  SECURITY = "SECURITY",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  PRODUCT_MANAGER = "PRODUCT_MANAGER",
  DATA_SCIENTIST = "DATA_SCIENTIST",
  DEVOPS = "DEVOPS",
  UI_UX_DESIGNER = "UI_UX_DESIGNER",
  SYSTEM_ADMINISTRATOR = "SYSTEM_ADMINISTRATOR",
  DATABASE_ADMINISTRATOR = "DATABASE_ADMINISTRATOR",
  MOBILE_DEVELOPER = "MOBILE_DEVELOPER",
  EMBEDDED_DEVELOPER = "EMBEDDED_DEVELOPER",
  QA = "QA",
  NETWORK_ENGINEER = "NETWORK_ENGINEER",
  CLOUD_ENGINEER = "CLOUD_ENGINEER",
  MACHINE_LEARNING_ENGINEER = "MACHINE_LEARNING_ENGINEER",
  ANALYST = "ANALYST",
  SCRUM_MASTER = "SCRUM_MASTER",
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  CAD = "CAD",
  AUD = "AUD",
  RUB = "RUB",
  UAH = "UAH",
  BYN = "BYN",
}

export enum SourceName {
  LINKEDIN = "LINKEDIN",
  INDEED = "INDEED",
  GLASSDOOR = "GLASSDOOR",
  HH = "HH",
}

export enum Seniority {
  JUNIOR = "JUNIOR",
  MIDDLE = "MIDDLE",
  SENIOR = "SENIOR",
  LEAD = "LEAD",
}

export enum Remote {
  HYBRID = "HYBRID",
  ON_SITE = "ON_SITE",
  REMOTE = "REMOTE",
}

export enum EmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
}

export type RouterUser = RouterOutputs["users"]["get"];

export type Models = "gpt-4" | "mixtral" | "gpt-3.5";

export type PartialVacancy = Partial<Vacancy> &
  Pick<
    Vacancy,
    "description" | "jobTitle" | "companyName" | "requiredSkills" | "id"
  >;

export type BigEntry = {
  place: string;
  period: string;
  description: string;
  descriptionSummary?: string;
  image: string;
  title: string;
  skills?: string[];
};
