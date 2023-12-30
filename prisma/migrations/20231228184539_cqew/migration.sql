/*
  Warnings:

  - You are about to drop the `_UserVacancy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserVacancy" DROP CONSTRAINT "_UserVacancy_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserVacancy" DROP CONSTRAINT "_UserVacancy_B_fkey";

-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "_UserVacancy";

-- AddForeignKey
ALTER TABLE "Vacancy" ADD CONSTRAINT "Vacancy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
