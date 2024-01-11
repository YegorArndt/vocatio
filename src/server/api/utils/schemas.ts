import { z } from "zod";

export type UserUpdateArgs = z.infer<typeof UserUpdateSchema>;

export const SkillLevel = z.enum([
  "BASIC",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
  "NATIVE",
]);

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

export const LanguageEntrySchema = z
  .object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    name: z.string(),
    level: SkillLevel,
    userId: z.string(),
  })
  .partial();

export const SkillEntrySchema = z
  .object({
    id: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    name: z.string().optional(),
    level: SkillLevel.optional(),
    userId: z.string().optional(),
  })
  .partial();

export const EducationEntrySchema = z
  .object({
    id: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
    place: z.string(),
    period: z.string(),
    description: z.string(),
    image: z.string(),
    title: z.string(),
    userId: z.string().uuid(),
  })
  .partial();

export const EmploymentHistoryEntrySchema = z
  .object({
    id: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
    place: z.string(),
    period: z.string(),
    description: z.string(),
    descriptionSummary: z.string(),
    skills: z.array(z.string()),
    image: z.string(),
    title: z.string(),
    userId: z.string().uuid(),
  })
  .partial();

export const ContactSchema = z
  .object({
    location: z.string(),
    email: z.string(),
    phone: z.string(),
    github: z.string(),
    linkedin: z.string(),
    indeed: z.string(),
    glassdoor: z.string(),
    hh: z.string(),
    facebook: z.string(),
    instagram: z.string(),
    twitter: z.string(),
    telegram: z.string(),
    skype: z.string(),
    vk: z.string(),
    website: z.string(),
    address: z.string(),
    country: z.string(),
    city: z.string(),
    zip: z.string(),
  })
  .partial();

const RecommendationsEntrySchema = z
  .object({
    id: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
    place: z.string(),
    period: z.string(),
    description: z.string(),
    image: z.string(),
    title: z.string(),
    userId: z.string().uuid(),
  })
  .partial();

export const UserUpdateSchema = z
  .object({
    name: z.string(),
    image: z.string().optional(),
    professionalSummary: z.string(),

    jobTitle: z.string().optional(),
    professionField: ProfessionField,

    languages: z.array(LanguageEntrySchema),
    skills: z.array(SkillEntrySchema),
    education: z.array(EducationEntrySchema),
    employmentHistory: z.array(EmploymentHistoryEntrySchema),

    contact: ContactSchema,

    recommendations: z.array(RecommendationsEntrySchema),
  })
  .partial();

export const PartialVacancySchema = z.object({
  id: z.string().nullable().optional(),

  description: z.string().nullable().optional(),

  jobTitle: z.string().nullable().optional(),

  companyName: z.string().nullable().optional(),

  requiredSkills: z.string().nullable().optional(),

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
});

export const LsDraft = z.object({
  vacancyId: z.string(),
  jobTitle: z.string(),
  professionalSummary: z.string(),
  topSkills: z.string(),
  employmentHistory: EmploymentHistoryEntrySchema.extend(
    z.object({
      originalEmploymentHistoryId: z.string(),
    }).shape
  ).array(),
});
