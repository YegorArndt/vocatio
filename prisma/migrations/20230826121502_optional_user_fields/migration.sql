/*
  Warnings:

  - A unique constraint covering the columns `[companyName,jobTitle]` on the table `Vacancy` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ownImage` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "ownJobTitle" DROP NOT NULL,
ALTER COLUMN "ownEducation" DROP NOT NULL,
ALTER COLUMN "ownStories" DROP NOT NULL,
ALTER COLUMN "ownObjective" DROP NOT NULL,
ALTER COLUMN "ownImage" SET NOT NULL,
ALTER COLUMN "ownExperienceYears" DROP NOT NULL,
ALTER COLUMN "ownLanguages" DROP NOT NULL,
ALTER COLUMN "ownSkills" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vacancy_companyName_jobTitle_key" ON "Vacancy"("companyName", "jobTitle");
