/*
  Warnings:

  - A unique constraint covering the columns `[companyName,jobTitle,location]` on the table `Vacancy` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Draft" DROP CONSTRAINT "Draft_vacancyId_fkey";

-- DropIndex
DROP INDEX "Vacancy_companyName_jobTitle_key";

-- AlterTable
ALTER TABLE "Draft" ALTER COLUMN "vacancyId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vacancy_companyName_jobTitle_location_key" ON "Vacancy"("companyName", "jobTitle", "location");
