/*
  Warnings:

  - You are about to drop the column `objective` on the `Draft` table. All the data in the column will be lost.
  - You are about to drop the column `objective` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Adjustable" AS ENUM ('jobTitle', 'employmentHistory', 'professionalSummary', 'skills', 'location', 'languages', 'education');

-- AlterTable
ALTER TABLE "Draft" DROP COLUMN "objective",
ADD COLUMN     "professionalSummary" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "objective",
ADD COLUMN     "adjustCompletely" "Adjustable"[],
ADD COLUMN     "adjustSlightly" "Adjustable"[],
ADD COLUMN     "professionalSummary" TEXT;
