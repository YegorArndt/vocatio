/*
  Warnings:

  - You are about to drop the column `defaultModel` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `salaryMax` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `salaryMin` on the `Vacancy` table. All the data in the column will be lost.
  - The `requiredRemote` column on the `Vacancy` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `requiredSeniority` column on the `Vacancy` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `employmentType` column on the `Vacancy` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "defaultModel";

-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "salaryMax",
DROP COLUMN "salaryMin",
ADD COLUMN     "salary" TEXT,
DROP COLUMN "requiredRemote",
ADD COLUMN     "requiredRemote" TEXT,
DROP COLUMN "requiredSeniority",
ADD COLUMN     "requiredSeniority" TEXT,
DROP COLUMN "employmentType",
ADD COLUMN     "employmentType" TEXT;

-- DropEnum
DROP TYPE "DefaultModel";

-- DropEnum
DROP TYPE "EmploymentType";

-- DropEnum
DROP TYPE "Remote";

-- DropEnum
DROP TYPE "Seniority";
