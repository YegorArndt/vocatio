-- AlterTable
ALTER TABLE "Vacancy" ALTER COLUMN "group" DROP NOT NULL,
ALTER COLUMN "group" DROP DEFAULT;

-- CreateTable
CREATE TABLE "VacancyGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "VacancyGroup_pkey" PRIMARY KEY ("id")
);
