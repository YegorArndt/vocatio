/*
  Warnings:

  - The values [UNKNOWN] on the enum `EmploymentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [UNKNOWN] on the enum `ProfessionField` will be removed. If these variants are still used in the database, this will fail.
  - The values [UNKNOWN] on the enum `Remote` will be removed. If these variants are still used in the database, this will fail.
  - The values [UNKNOWN] on the enum `Seniority` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `languages` on the `Cv` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `Cv` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `desiredSalary` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ownLanguages` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ownSkills` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `requiredLanguages` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `requiredSkills` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `salaryRange` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Vacancy` table. All the data in the column will be lost.
  - The `requiredYears` column on the `Vacancy` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Cv` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `experienceYears` on the `Cv` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `ownName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `ownExperienceYears` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `description` to the `Vacancy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vacancy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numApplicants` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SourceName" AS ENUM ('LINKEDIN', 'INDEED', 'GLASSDOOR', 'HH');

-- AlterEnum
BEGIN;
CREATE TYPE "EmploymentType_new" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT');
ALTER TABLE "Vacancy" ALTER COLUMN "employmentType" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "desiredEmploymentType" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "desiredEmploymentType" TYPE "EmploymentType_new" USING ("desiredEmploymentType"::text::"EmploymentType_new");
ALTER TABLE "Vacancy" ALTER COLUMN "employmentType" TYPE "EmploymentType_new" USING ("employmentType"::text::"EmploymentType_new");
ALTER TYPE "EmploymentType" RENAME TO "EmploymentType_old";
ALTER TYPE "EmploymentType_new" RENAME TO "EmploymentType";
DROP TYPE "EmploymentType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProfessionField_new" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK', 'SECURITY', 'PROJECT_MANAGER', 'PRODUCT_MANAGER', 'DATA_SCIENTIST', 'DEVOPS', 'UX_DESIGNER', 'UI_DESIGNER', 'SYSTEM_ADMINISTRATOR', 'DATABASE_ADMINISTRATOR', 'MOBILE_DEVELOPER', 'EMBEDDED_DEVELOPER', 'QA', 'NETWORK_ENGINEER', 'CLOUD_ENGINEER', 'MACHINE_LEARNING_ENGINEER', 'ANALYST', 'SCRUM_MASTER');
ALTER TABLE "User" ALTER COLUMN "desiredProfessionField" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "desiredProfessionField" TYPE "ProfessionField_new" USING ("desiredProfessionField"::text::"ProfessionField_new");
ALTER TABLE "Vacancy" ALTER COLUMN "professionField" TYPE "ProfessionField_new" USING ("professionField"::text::"ProfessionField_new");
ALTER TYPE "ProfessionField" RENAME TO "ProfessionField_old";
ALTER TYPE "ProfessionField_new" RENAME TO "ProfessionField";
DROP TYPE "ProfessionField_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Remote_new" AS ENUM ('HYBRID', 'ON_SITE', 'REMOTE');
ALTER TABLE "Vacancy" ALTER COLUMN "requiredRemote" DROP DEFAULT;
ALTER TABLE "Cv" ALTER COLUMN "remote" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "desiredRemote" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "desiredRemote" TYPE "Remote_new" USING ("desiredRemote"::text::"Remote_new");
ALTER TABLE "Cv" ALTER COLUMN "remote" TYPE "Remote_new" USING ("remote"::text::"Remote_new");
ALTER TABLE "Vacancy" ALTER COLUMN "requiredRemote" TYPE "Remote_new" USING ("requiredRemote"::text::"Remote_new");
ALTER TYPE "Remote" RENAME TO "Remote_old";
ALTER TYPE "Remote_new" RENAME TO "Remote";
DROP TYPE "Remote_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Seniority_new" AS ENUM ('JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD');
ALTER TABLE "Vacancy" ALTER COLUMN "requiredSeniority" DROP DEFAULT;
ALTER TABLE "Cv" ALTER COLUMN "seniority" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "desiredSeniority" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "desiredSeniority" TYPE "Seniority_new" USING ("desiredSeniority"::text::"Seniority_new");
ALTER TABLE "Cv" ALTER COLUMN "seniority" TYPE "Seniority_new" USING ("seniority"::text::"Seniority_new");
ALTER TABLE "Vacancy" ALTER COLUMN "requiredSeniority" TYPE "Seniority_new" USING ("requiredSeniority"::text::"Seniority_new");
ALTER TYPE "Seniority" RENAME TO "Seniority_old";
ALTER TYPE "Seniority_new" RENAME TO "Seniority";
DROP TYPE "Seniority_old";
COMMIT;

-- DropIndex
DROP INDEX "Cv_userId_idx";

-- DropIndex
DROP INDEX "Cv_vacancyId_idx";

-- DropIndex
DROP INDEX "Vacancy_userId_idx";

-- AlterTable
ALTER TABLE "Cv" DROP COLUMN "languages",
DROP COLUMN "skills",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "experienceYears",
ADD COLUMN     "experienceYears" INTEGER NOT NULL,
ALTER COLUMN "remote" DROP NOT NULL,
ALTER COLUMN "remote" DROP DEFAULT,
ALTER COLUMN "seniority" DROP NOT NULL,
ALTER COLUMN "seniority" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "desiredSalary",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "ownLanguages",
DROP COLUMN "ownSkills",
ADD COLUMN     "desiredSalaryMax" INTEGER,
ADD COLUMN     "desiredSalaryMin" INTEGER,
ADD COLUMN     "glassdoorUrl" TEXT,
ADD COLUMN     "hhUrl" TEXT,
ADD COLUMN     "indeedUrl" TEXT,
ADD COLUMN     "ownCity" TEXT,
ADD COLUMN     "ownCountry" TEXT,
ADD COLUMN     "ownImage" TEXT,
ADD COLUMN     "ownName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "ownExperienceYears",
ADD COLUMN     "ownExperienceYears" INTEGER NOT NULL,
ALTER COLUMN "desiredProfessionField" DROP NOT NULL,
ALTER COLUMN "desiredProfessionField" DROP DEFAULT,
ALTER COLUMN "desiredRemote" DROP NOT NULL,
ALTER COLUMN "desiredRemote" DROP DEFAULT,
ALTER COLUMN "desiredSeniority" DROP NOT NULL,
ALTER COLUMN "desiredSeniority" DROP DEFAULT,
ALTER COLUMN "desiredEmploymentType" DROP NOT NULL,
ALTER COLUMN "desiredEmploymentType" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "requiredLanguages",
DROP COLUMN "requiredSkills",
DROP COLUMN "requirements",
DROP COLUMN "salaryRange",
DROP COLUMN "source",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "salaryMax" INTEGER,
ADD COLUMN     "salaryMin" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "numApplicants",
ADD COLUMN     "numApplicants" INTEGER NOT NULL,
ALTER COLUMN "requiredRemote" DROP NOT NULL,
ALTER COLUMN "requiredRemote" DROP DEFAULT,
ALTER COLUMN "requiredSeniority" DROP NOT NULL,
ALTER COLUMN "requiredSeniority" DROP DEFAULT,
ALTER COLUMN "employmentType" DROP NOT NULL,
ALTER COLUMN "employmentType" DROP DEFAULT,
DROP COLUMN "requiredYears",
ADD COLUMN     "requiredYears" INTEGER;

-- DropEnum
DROP TYPE "Source";

-- CreateTable
CREATE TABLE "CvCustomField" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "CvCustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "name" "SourceName" NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VacancySource" (
    "id" TEXT NOT NULL,
    "vacancyId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "link" TEXT,

    CONSTRAINT "VacancySource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CvToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CvToLanguage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SkillToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SkillToVacancy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LanguageToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LanguageToVacancy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VacancySource_vacancyId_sourceId_key" ON "VacancySource"("vacancyId", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "_CvToSkill_AB_unique" ON "_CvToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_CvToSkill_B_index" ON "_CvToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CvToLanguage_AB_unique" ON "_CvToLanguage"("A", "B");

-- CreateIndex
CREATE INDEX "_CvToLanguage_B_index" ON "_CvToLanguage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SkillToUser_AB_unique" ON "_SkillToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SkillToUser_B_index" ON "_SkillToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SkillToVacancy_AB_unique" ON "_SkillToVacancy"("A", "B");

-- CreateIndex
CREATE INDEX "_SkillToVacancy_B_index" ON "_SkillToVacancy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LanguageToUser_AB_unique" ON "_LanguageToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LanguageToUser_B_index" ON "_LanguageToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LanguageToVacancy_AB_unique" ON "_LanguageToVacancy"("A", "B");

-- CreateIndex
CREATE INDEX "_LanguageToVacancy_B_index" ON "_LanguageToVacancy"("B");

-- AddForeignKey
ALTER TABLE "Cv" ADD CONSTRAINT "Cv_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cv" ADD CONSTRAINT "Cv_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvCustomField" ADD CONSTRAINT "CvCustomField_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacancy" ADD CONSTRAINT "Vacancy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VacancySource" ADD CONSTRAINT "VacancySource_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VacancySource" ADD CONSTRAINT "VacancySource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CvToSkill" ADD CONSTRAINT "_CvToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Cv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CvToSkill" ADD CONSTRAINT "_CvToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CvToLanguage" ADD CONSTRAINT "_CvToLanguage_A_fkey" FOREIGN KEY ("A") REFERENCES "Cv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CvToLanguage" ADD CONSTRAINT "_CvToLanguage_B_fkey" FOREIGN KEY ("B") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToUser" ADD CONSTRAINT "_SkillToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToUser" ADD CONSTRAINT "_SkillToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToVacancy" ADD CONSTRAINT "_SkillToVacancy_A_fkey" FOREIGN KEY ("A") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToVacancy" ADD CONSTRAINT "_SkillToVacancy_B_fkey" FOREIGN KEY ("B") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageToUser" ADD CONSTRAINT "_LanguageToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageToUser" ADD CONSTRAINT "_LanguageToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageToVacancy" ADD CONSTRAINT "_LanguageToVacancy_A_fkey" FOREIGN KEY ("A") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageToVacancy" ADD CONSTRAINT "_LanguageToVacancy_B_fkey" FOREIGN KEY ("B") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
