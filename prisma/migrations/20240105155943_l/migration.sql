/*
  Warnings:

  - You are about to drop the column `userId` on the `Draft` table. All the data in the column will be lost.
  - Made the column `jobTitle` on table `Draft` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vacancyId` on table `Draft` required. This step will fail if there are existing NULL values in that column.
  - Made the column `professionalSummary` on table `Draft` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Draft" DROP CONSTRAINT "Draft_userId_fkey";

-- AlterTable
ALTER TABLE "Draft" DROP COLUMN "userId",
ADD COLUMN     "topSkills" TEXT[],
ALTER COLUMN "jobTitle" SET NOT NULL,
ALTER COLUMN "vacancyId" SET NOT NULL,
ALTER COLUMN "professionalSummary" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
