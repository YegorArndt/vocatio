/*
  Warnings:

  - You are about to drop the column `adjustCompletely` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `adjustSlightly` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "adjustCompletely",
DROP COLUMN "adjustSlightly";

-- AlterTable
ALTER TABLE "Vacancy" ALTER COLUMN "summary" DROP NOT NULL;

-- DropEnum
DROP TYPE "Adjustable";
