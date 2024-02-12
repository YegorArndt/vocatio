/*
  Warnings:

  - You are about to drop the column `shadowDescription` on the `ExperienceEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExperienceEntry" DROP COLUMN "shadowDescription",
ADD COLUMN     "enhancedDescription" TEXT;
