-- AlterTable
ALTER TABLE "EmploymentHistoryEntry" ADD COLUMN     "draftId" TEXT;

-- AddForeignKey
ALTER TABLE "EmploymentHistoryEntry" ADD CONSTRAINT "EmploymentHistoryEntry_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "Draft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
