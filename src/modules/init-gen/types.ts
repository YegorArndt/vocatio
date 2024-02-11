import type { ExperienceEntry, Vacancy } from "@prisma/client";
import type { RouterOutputs } from "~/utils/api";

export type RouterUser = RouterOutputs["users"]["get"];

export type Models = "gpt-4" | "mixtral" | "gpt-3.5";

export type PartialVacancy = Partial<Vacancy> &
  Pick<
    Vacancy,
    "description" | "jobTitle" | "companyName" | "requiredSkills" | "id"
  >;

export type GeneratedDraft = {
  vacancy: PartialVacancy;
  vacancyResponsibilities: string[];
  vacancySkills: string[];

  generatedProfessionalSummary: string;
  generatedExperience: (ExperienceEntry & { generatedDescription: string[] })[];
  generatedSkills: { id: string; name: string }[];
  coverLetter?: string;
} & RouterUser;

export type GeneratedExperience = GeneratedDraft["generatedExperience"];
