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
CREATE TYPE "SkillLevel" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "level" "SkillLevel" NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT,
    "skillId" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "educationId" TEXT,
    "employmentHistoryId" TEXT,
    "recommendationsId" TEXT,
    "awardsId" TEXT,
    "certificatesId" TEXT,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomMedia" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "CustomMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "linkedin" TEXT NOT NULL,
    "facebook" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "twitter" TEXT NOT NULL,
    "telegram" TEXT NOT NULL,
    "skype" TEXT NOT NULL,
    "vk" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "professionField" "ProfessionField",
    "objectives" TEXT[],
    "images" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vacancy" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "image" TEXT,
    "companyName" TEXT,
    "location" TEXT,
    "country" TEXT,
    "age" TIMESTAMP(3),
    "numApplicants" INTEGER,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "isAnnualSalary" BOOLEAN,
    "salaryCurrency" TEXT,
    "jobTitle" TEXT,
    "description" TEXT,
    "professionField" "ProfessionField",
    "requiredRemote" "Remote",
    "requiredSeniority" "Seniority",
    "employmentType" "EmploymentType",
    "requiredYearsMin" INTEGER,
    "requiredYearsMax" INTEGER,
    "requiredEducation" TEXT,
    "requiredLanguages" TEXT,
    "requiredSkills" TEXT,
    "sourceUrl" TEXT,
    "sourceName" "SourceName",

    CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry__language_fkey" ON "Skill"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "Entry__skill_fkey" ON "Skill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "Entry__education_fkey" ON "Entry"("educationId");

-- CreateIndex
CREATE UNIQUE INDEX "Entry__employmentHistory_fkey" ON "Entry"("employmentHistoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Entry__recommendations_fkey" ON "Entry"("recommendationsId");

-- CreateIndex
CREATE UNIQUE INDEX "Entry__awards_fkey" ON "Entry"("awardsId");

-- CreateIndex
CREATE UNIQUE INDEX "Entry__certificates_fkey" ON "Entry"("certificatesId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_userId_key" ON "Contact"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Vacancy_companyName_jobTitle_key" ON "Vacancy"("companyName", "jobTitle");

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_employmentHistoryId_fkey" FOREIGN KEY ("employmentHistoryId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_recommendationsId_fkey" FOREIGN KEY ("recommendationsId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_awardsId_fkey" FOREIGN KEY ("awardsId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_certificatesId_fkey" FOREIGN KEY ("certificatesId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomMedia" ADD CONSTRAINT "CustomMedia_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacancy" ADD CONSTRAINT "Vacancy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
