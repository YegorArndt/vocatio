/*
  Warnings:

  - You are about to drop the column `userId` on the `Vacancy` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Draft` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vacancy" DROP CONSTRAINT "Vacancy_userId_fkey";

-- AlterTable
ALTER TABLE "Draft" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_UserToVacancy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToVacancy_AB_unique" ON "_UserToVacancy"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToVacancy_B_index" ON "_UserToVacancy"("B");

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVacancy" ADD CONSTRAINT "_UserToVacancy_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVacancy" ADD CONSTRAINT "_UserToVacancy_B_fkey" FOREIGN KEY ("B") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
