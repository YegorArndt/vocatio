import type { ExperienceEntry } from "@prisma/client";
import type { PartialVacancy, RouterUser } from "../types";

export type GeneratedExperienceEntry = Omit<ExperienceEntry, "description"> & {
  description: string[];
};

export type GeneratedSkills = GeneratedData["generatedSkills"];

export type GeneratedData = {
  vacancy: PartialVacancy;
  vacancyResponsibilities: string[];
  vacancySkills: string[];

  generatedProfessionalSummary: string;
  generatedExperience: GeneratedExperienceEntry[];
  generatedSkills: { id: string; name: string }[];
  fileName: string;
  coverLetter?: string;
} & RouterUser;
