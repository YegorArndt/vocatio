import { z } from "zod";

export type UserUpdateArgs = z.infer<typeof UserUpdateSchema>;

export const SkillLevel = z.enum([
  "BASIC",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
  "NATIVE",
]);

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

export const LanguageEntrySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  level: SkillLevel,
  userId: z.string(),
});

export const SkillEntrySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  level: SkillLevel,
  userId: z.string(),
});

export const EducationEntrySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  place: z.string(),
  period: z.string(),
  description: z.string(),
  image: z.string(),
  title: z.string(),
  userId: z.string().uuid(),
});

export const EmploymentHistoryEntrySchema = z.object({
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
});

export const ContactSchema = z
  .object({
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

const RecommendationsEntrySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  place: z.string(),
  period: z.string(),
  description: z.string(),
  image: z.string(),
  title: z.string(),
  userId: z.string().uuid(),
});

export const UserUpdateSchema = z
  .object({
    name: z.string(),
    image: z.string(),
    professionalSummary: z.string(),

    jobTitle: z.string(),
    professionField: ProfessionField,

    languages: z.array(LanguageEntrySchema),
    skills: z.array(SkillEntrySchema),
    education: z.array(EducationEntrySchema),
    employmentHistory: z.array(EmploymentHistoryEntrySchema),

    contact: ContactSchema,

    recommendations: z.array(RecommendationsEntrySchema),
  })
  .partial();
