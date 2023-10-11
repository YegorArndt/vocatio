-- CreateEnum
CREATE TYPE "Source" AS ENUM ('LINKEDIN', 'INDEED', 'GLASSDOOR', 'HH', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Seniority" AS ENUM ('JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Remote" AS ENUM ('HYBRID', 'ON_SITE', 'REMOTE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ProfessionField" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK', 'SECURITY', 'PROJECT_MANAGER', 'PRODUCT_MANAGER', 'DATA_SCIENTIST', 'DEVOPS', 'UX_DESIGNER', 'UI_DESIGNER', 'SYSTEM_ADMINISTRATOR', 'DATABASE_ADMINISTRATOR', 'MOBILE_DEVELOPER', 'EMBEDDED_DEVELOPER', 'QA', 'NETWORK_ENGINEER', 'CLOUD_ENGINEER', 'MACHINE_LEARNING_ENGINEER', 'ANALYST', 'SCRUM_MASTER', 'UNKNOWN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "country" TEXT,
    "linkedInUrl" TEXT,
    "city" TEXT,
    "ownJobTitle" TEXT NOT NULL,
    "ownEducation" TEXT NOT NULL,
    "ownExperienceYears" TEXT NOT NULL,
    "ownStories" TEXT NOT NULL,
    "ownSkills" TEXT NOT NULL,
    "ownLanguages" TEXT NOT NULL,
    "ownObjective" TEXT NOT NULL,
    "desiredProfessionField" "ProfessionField" NOT NULL DEFAULT 'UNKNOWN',
    "desiredRemote" "Remote" NOT NULL DEFAULT 'UNKNOWN',
    "desiredSalary" TEXT,
    "desiredSeniority" "Seniority" NOT NULL DEFAULT 'UNKNOWN',
    "desiredEmploymentType" "EmploymentType" NOT NULL DEFAULT 'UNKNOWN',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vacancy" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT,
    "age" TIMESTAMP(3) NOT NULL,
    "numApplicants" TEXT,
    "salaryRange" TEXT,
    "jobTitle" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "professionField" "ProfessionField" NOT NULL,
    "requiredRemote" "Remote" NOT NULL DEFAULT 'UNKNOWN',
    "requiredSeniority" "Seniority" NOT NULL DEFAULT 'UNKNOWN',
    "source" "Source" NOT NULL DEFAULT 'UNKNOWN',
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'UNKNOWN',
    "requiredYears" TEXT,
    "requiredEducation" TEXT,
    "requiredLanguages" TEXT,
    "requiredSkills" TEXT,

    CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cv" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "experienceYears" TEXT NOT NULL,
    "stories" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "image" TEXT,
    "country" TEXT,
    "city" TEXT,
    "remote" "Remote" NOT NULL DEFAULT 'UNKNOWN',
    "userId" TEXT NOT NULL,
    "seniority" "Seniority" NOT NULL DEFAULT 'UNKNOWN',
    "vacancyId" TEXT NOT NULL,

    CONSTRAINT "Cv_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vacancy_userId_idx" ON "Vacancy"("userId");

-- CreateIndex
CREATE INDEX "Cv_userId_idx" ON "Cv"("userId");

-- CreateIndex
CREATE INDEX "Cv_vacancyId_idx" ON "Cv"("vacancyId");
