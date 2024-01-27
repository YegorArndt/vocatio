-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'RUB', 'UAH', 'BYN');

-- CreateEnum
CREATE TYPE "SourceName" AS ENUM ('LINKEDIN', 'INDEED', 'GLASSDOOR', 'HH');

-- CreateEnum
CREATE TYPE "Seniority" AS ENUM ('JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD');

-- CreateEnum
CREATE TYPE "Remote" AS ENUM ('HYBRID', 'ON_SITE', 'REMOTE');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT');

-- CreateEnum
CREATE TYPE "ProfessionField" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK', 'SECURITY', 'PROJECT_MANAGER', 'PRODUCT_MANAGER', 'DATA_SCIENTIST', 'DEVOPS', 'UI_UX_DESIGNER', 'SYSTEM_ADMINISTRATOR', 'DATABASE_ADMINISTRATOR', 'MOBILE_DEVELOPER', 'EMBEDDED_DEVELOPER', 'QA', 'NETWORK_ENGINEER', 'CLOUD_ENGINEER', 'MACHINE_LEARNING_ENGINEER', 'ANALYST', 'SCRUM_MASTER');

-- CreateEnum
CREATE TYPE "DefaultModel" AS ENUM ('GPT3', 'GPT4', 'MIXTRAL');

-- CreateTable
CREATE TABLE "ContactEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ContactEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LanguageEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LanguageEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SkillEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EducationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shadowDescription" TEXT NOT NULL,
    "skills" TEXT[],
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ExperienceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DraftExperienceEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "skills" TEXT[],
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "originalExperienceEntryId" TEXT NOT NULL,
    "draftId" TEXT,

    CONSTRAINT "DraftExperienceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationsEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RecommendationsEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "jobTitle" TEXT,
    "linkedinId" TEXT,
    "email" TEXT,
    "professionalSummary" TEXT,
    "professionField" "ProfessionField",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Draft" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "professionalSummary" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "topSkills" TEXT[],
    "userId" TEXT NOT NULL,
    "vacancyId" TEXT NOT NULL,

    CONSTRAINT "Draft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VacancyGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "VacancyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vacancy" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "companyName" TEXT,
    "location" TEXT,
    "country" TEXT,
    "age" TIMESTAMP(3),
    "numApplicants" TEXT,
    "salaryMin" TEXT,
    "salaryMax" TEXT,
    "isAnnualSalary" BOOLEAN DEFAULT false,
    "salaryCurrency" "Currency" DEFAULT 'USD',
    "jobTitle" TEXT,
    "professionField" "ProfessionField",
    "summary" TEXT,
    "description" TEXT,
    "requiredSkills" TEXT,
    "group" TEXT,
    "requiredRemote" "Remote",
    "requiredSeniority" "Seniority",
    "employmentType" "EmploymentType",
    "requiredYearsMin" TEXT,
    "requiredYearsMax" TEXT,
    "requiredEducation" TEXT,
    "requiredLanguages" TEXT[],
    "sourceUrl" TEXT,
    "sourceName" TEXT,

    CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cv" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "a4" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "intrinsic" JSONB NOT NULL,
    "image" TEXT NOT NULL,
    "pokemonImage" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vacancyId" TEXT NOT NULL,

    CONSTRAINT "Cv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToVacancy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToVacancy_AB_unique" ON "_UserToVacancy"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToVacancy_B_index" ON "_UserToVacancy"("B");

-- AddForeignKey
ALTER TABLE "ContactEntry" ADD CONSTRAINT "ContactEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageEntry" ADD CONSTRAINT "LanguageEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillEntry" ADD CONSTRAINT "SkillEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationEntry" ADD CONSTRAINT "EducationEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceEntry" ADD CONSTRAINT "ExperienceEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftExperienceEntry" ADD CONSTRAINT "DraftExperienceEntry_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "Draft"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationsEntry" ADD CONSTRAINT "RecommendationsEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cv" ADD CONSTRAINT "Cv_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cv" ADD CONSTRAINT "Cv_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVacancy" ADD CONSTRAINT "_UserToVacancy_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVacancy" ADD CONSTRAINT "_UserToVacancy_B_fkey" FOREIGN KEY ("B") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
