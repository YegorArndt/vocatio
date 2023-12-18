/*
  Warnings:

  - You are about to drop the column `font` on the `Cv` table. All the data in the column will be lost.
  - Added the required column `descriptionSummary` to the `EmploymentHistoryEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cv" DROP COLUMN "font";

-- AlterTable
ALTER TABLE "EmploymentHistoryEntry" ADD COLUMN     "descriptionSummary" TEXT NOT NULL,
ADD COLUMN     "skills" TEXT[];
