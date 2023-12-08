import {
  AwardsEntry,
  CertificatesEntry,
  EducationEntry,
  EmploymentHistoryEntry,
  LanguageEntry,
  RecommendationsEntry,
  SkillEntry,
} from "@prisma/client";

export type EntryFor =
  | "languages"
  | "skills"
  | "education"
  | "employmentHistory"
  | "recommendations";

export type FineTuneBoxProps = {
  entryFor: EntryFor;
};

export type DbEntry = LanguageEntry | SkillEntry;

export type DbBigEntry =
  | EducationEntry
  | EmploymentHistoryEntry
  | RecommendationsEntry
  | AwardsEntry
  | CertificatesEntry;
