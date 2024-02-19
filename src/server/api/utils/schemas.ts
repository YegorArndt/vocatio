import { z } from "zod";

export type UserUpdateArgs = z.infer<typeof UserUpdateSchema>;

export const SalaryCurrency = z.enum([
  "USD",
  "GBP",
  "EUR",
  "CAD",
  "AUD",
  "RUB",
  "UAH",
  "BYN",
]);

export const Remote = z.enum(["HYBRID", "ON_SITE", "REMOTE"]);

export const EmploymentType = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]);

export const Seniority = z.enum(["JUNIOR", "MIDDLE", "SENIOR", "LEAD"]);

export const DefaultModel = z.enum(["GPT3", "GPT4"]);

export const ProfessionField = z.enum([
  "FRONTEND",
  "BACKEND",
  "FULLSTACK",
  "SECURITY",
  "PROJECT_MANAGER",
  "PRODUCT_MANAGER",
  "DATA_SCIENTIST",
  "DEVOPS",
  "UI_UX_DESIGNER",
  "SYSTEM_ADMINISTRATOR",
  "DATABASE_ADMINISTRATOR",
  "MOBILE_DEVELOPER",
  "EMBEDDED_DEVELOPER",
  "QA",
  "NETWORK_ENGINEER",
  "CLOUD_ENGINEER",
  "MACHINE_LEARNING_ENGINEER",
  "ANALYST",
  "SCRUM_MASTER",
]);

const DateOrString = z.union([z.string(), z.date()]);

export const LanguageEntrySchema = z
  .object({
    id: z.string(),
    createdAt: DateOrString,
    updatedAt: DateOrString,
    name: z.string(),
    value: z.string(),
  })
  .partial();

export const SkillEntrySchema = z
  .object({
    id: z.string().optional(),
    createdAt: DateOrString,
    updatedAt: DateOrString,
    name: z.string().optional(),
    value: z.string(),
  })
  .partial();

export const ContactEntrySchema = z
  .object({
    id: z.string().optional(),
    createdAt: DateOrString,
    updatedAt: DateOrString,
    name: z.string(),
    value: z.string(),
  })
  .partial();

export const EducationEntrySchema = z
  .object({
    id: z.string().uuid(),
    createdAt: DateOrString,
    updatedAt: DateOrString,
    place: z.string(),
    period: z.string(),
    description: z.string(),
    image: z.string(),
    title: z.string(),
  })
  .partial();

export const ExperienceEntrySchema = z
  .object({
    id: z.string().uuid(),
    createdAt: DateOrString,
    updatedAt: DateOrString,
    place: z.string().optional().nullable(),
    period: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    enhancedDescription: z.string().optional().nullable(),
    skills: z.array(z.string()).nullable(),
    image: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
  })
  .partial();

export const UserUpdateSchema = z
  .object({
    image: z.string().optional(),
    name: z.string(),
    jobTitle: z.string().optional(),
    professionalSummary: z.string(),

    linkedinId: z.string().optional(),
    email: z.string().optional(),

    defaultModel: DefaultModel.optional(),

    contact: z.array(ContactEntrySchema),
    languages: z.array(LanguageEntrySchema),
    skills: z.array(SkillEntrySchema),

    experience: z.array(ExperienceEntrySchema),
    education: z.array(EducationEntrySchema),
  })
  .partial();

export const PartialVacancySchema = z.object({
  id: z.string().nullable().optional(),

  image: z.string().nullable().optional(),

  description: z.string().nullable().optional(),

  jobTitle: z.string().nullable().optional(),

  companyName: z.string().nullable().optional(),

  requiredSkills: z.array(z.string()).nullable().optional(),

  group: z.string().nullable().optional(),

  summary: z.string().nullable().optional(),

  location: z.string().nullable().optional(),

  country: z.string().nullable().optional(),

  age: z.string().nullable().optional(),

  numApplicants: z.string().nullable().optional(),

  salaryMin: z.string().nullable().optional(),

  salaryMax: z.string().nullable().optional(),

  isAnnualSalary: z.boolean().nullable().optional(),

  salaryCurrency: SalaryCurrency.nullable().optional(),

  professionField: ProfessionField.nullable().optional(),

  requiredRemote: Remote.nullable().optional(),

  requiredSeniority: Seniority.nullable().optional(),

  employmentType: EmploymentType.nullable().optional(),

  requiredYearsMin: z.string().nullable().optional(),

  requiredYearsMax: z.string().nullable().optional(),

  requiredEducation: z.string().nullable().optional(),

  requiredLanguages: z.array(z.string()).nullable().optional(),

  sourceUrl: z.string().nullable().optional(),

  sourceName: z.string().nullable().optional(),

  responsibilities: z.array(z.string()).nullable().optional(),
});

export const GeneratedData = z.object({
  vacancyId: z.string(),
  jobTitle: z.string(),
  professionalSummary: z.string(),
  topSkills: z.string(),
  experience: ExperienceEntrySchema.extend(
    z.object({
      originalexperienceId: z.string(),
    }).shape
  ).array(),
});
