/*
  Warnings:

  - The `sourceName` column on the `Vacancy` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "group" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "requiredSkills" DROP NOT NULL,
ALTER COLUMN "sourceUrl" DROP NOT NULL,
DROP COLUMN "sourceName",
ADD COLUMN     "sourceName" TEXT;
