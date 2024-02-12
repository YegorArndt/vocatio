import type { ExperienceEntry } from "@prisma/client";
import type { PartialVacancy, RouterUser } from "../types";

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
