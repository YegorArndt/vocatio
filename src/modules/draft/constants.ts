import type { Story } from "@prisma/client";

export const dbIds = [
  "user-name",
  "job-title",
  "objective",
  "email",
  "experience",
  "skills-list",
  "country",
  "city",
  "address",
  "phone",
  "linkedin",
  "github",
  "education-duration",
  "education-degree",
  "education-university",
  "english-level",
  "german-level",
  "russian-level",
  "spanish-level",
  "user-stories",
];

export type Defaults = Partial<
  Record<(typeof dbIds)[number], string | undefined | null | number | Story>
>;
