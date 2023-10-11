/*
  Warnings:

  - You are about to drop the `CustomCvField` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomCvSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UiComponent" AS ENUM ('TEXT', 'TEXTAREA', 'NUMBER', 'DATE', 'SELECT', 'PHONE_NUMBER', 'ADDRESS', 'LOCATION', 'URL', 'LANGUAGE', 'TEXT_WITH_LABEL', 'TEXTAREA_WITH_LABEL', 'NUMBER_WITH_LABEL', 'DATE_WITH_LABEL', 'SELECT_WITH_LABEL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H1_WITH_DIVIDER', 'H2_WITH_DIVIDER', 'H3_WITH_DIVIDER', 'H4_WITH_DIVIDER', 'H5_WITH_DIVIDER');

-- DropForeignKey
ALTER TABLE "CustomCvField" DROP CONSTRAINT "CustomCvField_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "CustomCvSection" DROP CONSTRAINT "CustomCvSection_cvId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ownLanguages" "LanguageLevel"[],
ADD COLUMN     "ownProfessionField" "ProfessionField";

-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "sourceName" "SourceName",
ADD COLUMN     "sourceUrl" TEXT;

-- DropTable
DROP TABLE "CustomCvField";

-- DropTable
DROP TABLE "CustomCvSection";

-- DropEnum
DROP TYPE "FieldComponent";

-- DropEnum
DROP TYPE "SectionComponent";

-- CreateTable
CREATE TABLE "CvAreas" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,

    CONSTRAINT "CvAreas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvComponent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "component" "UiComponent" NOT NULL,
    "index" INTEGER NOT NULL,
    "cvAreaId" TEXT NOT NULL,

    CONSTRAINT "CvComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Url" (
    "id" SERIAL NOT NULL,
    "original" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortCode_key" ON "Url"("shortCode");

-- AddForeignKey
ALTER TABLE "CvAreas" ADD CONSTRAINT "CvAreas_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvComponent" ADD CONSTRAINT "CvComponent_cvAreaId_fkey" FOREIGN KEY ("cvAreaId") REFERENCES "CvAreas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
