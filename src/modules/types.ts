import { Vacancy } from "@prisma/client";
import { RouterOutputs } from "~/utils/api";

export type RouterUser = RouterOutputs["users"]["get"];

export type Models = "gpt-4" | "mixtral" | "gpt-3.5";

export type PartialVacancy = Partial<Vacancy> &
  Pick<
    Vacancy,
    "description" | "jobTitle" | "companyName" | "requiredSkills" | "id"
  >;
