/*
  Warnings:

  - You are about to drop the column `draftId` on the `EmploymentHistoryEntry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmploymentHistoryEntry" DROP CONSTRAINT "EmploymentHistoryEntry_draftId_fkey";

-- AlterTable
ALTER TABLE "EmploymentHistoryEntry" DROP COLUMN "draftId";

-- CreateTable
CREATE TABLE "DraftEmploymentHistoryEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "skills" TEXT[],
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "originalEmploymentHistoryEntryId" TEXT NOT NULL,
    "draftId" TEXT,

    CONSTRAINT "DraftEmploymentHistoryEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DraftEmploymentHistoryEntry" ADD CONSTRAINT "DraftEmploymentHistoryEntry_originalEmploymentHistoryEntry_fkey" FOREIGN KEY ("originalEmploymentHistoryEntryId") REFERENCES "EmploymentHistoryEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftEmploymentHistoryEntry" ADD CONSTRAINT "DraftEmploymentHistoryEntry_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "Draft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
