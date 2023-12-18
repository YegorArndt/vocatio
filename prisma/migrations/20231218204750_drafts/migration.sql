/*
  Warnings:

  - You are about to drop the column `userId` on the `Vacancy` table. All the data in the column will be lost.
  - Added the required column `vacancyId` to the `Cv` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vacancy" DROP CONSTRAINT "Vacancy_userId_fkey";

-- DropIndex
DROP INDEX "Draft_vacancyId_key";

-- AlterTable
ALTER TABLE "Cv" ADD COLUMN     "vacancyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_UserVacancy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserVacancy_AB_unique" ON "_UserVacancy"("A", "B");

-- CreateIndex
CREATE INDEX "_UserVacancy_B_index" ON "_UserVacancy"("B");

-- AddForeignKey
ALTER TABLE "Cv" ADD CONSTRAINT "Cv_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserVacancy" ADD CONSTRAINT "_UserVacancy_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserVacancy" ADD CONSTRAINT "_UserVacancy_B_fkey" FOREIGN KEY ("B") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
