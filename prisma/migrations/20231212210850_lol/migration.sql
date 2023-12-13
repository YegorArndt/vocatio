/*
  Warnings:

  - The `requiredLanguages` column on the `Vacancy` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `summary` to the `Vacancy` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Vacancy` required. This step will fail if there are existing NULL values in that column.
  - Made the column `requiredSkills` on table `Vacancy` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sourceUrl` on table `Vacancy` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Currency" ADD VALUE 'RUB';
ALTER TYPE "Currency" ADD VALUE 'UAH';
ALTER TYPE "Currency" ADD VALUE 'BYN';

-- AlterTable
ALTER TABLE "EmploymentHistoryEntry" ADD COLUMN     "draftId" TEXT;

-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "summary" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
DROP COLUMN "requiredLanguages",
ADD COLUMN     "requiredLanguages" TEXT[],
ALTER COLUMN "requiredSkills" SET NOT NULL,
ALTER COLUMN "sourceUrl" SET NOT NULL;

-- CreateTable
CREATE TABLE "Draft" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jobTitle" TEXT,
    "objective" TEXT,
    "userId" TEXT NOT NULL,
    "vacancyId" TEXT NOT NULL,

    CONSTRAINT "Draft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cv" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "a4" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "intrinsic" JSONB NOT NULL,
    "font" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "pokemonImage" TEXT NOT NULL,

    CONSTRAINT "Cv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Draft_userId_key" ON "Draft"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Draft_vacancyId_key" ON "Draft"("vacancyId");

-- CreateIndex
CREATE UNIQUE INDEX "Url_userId_key" ON "Url"("userId");

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cv" ADD CONSTRAINT "Cv_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
