/*
  Warnings:

  - You are about to drop the column `enhancedDescription` on the `ExperienceEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExperienceEntry" DROP COLUMN "enhancedDescription";

-- CreateTable
CREATE TABLE "Bullet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,

    CONSTRAINT "Bullet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bullet" ADD CONSTRAINT "Bullet_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "ExperienceEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
