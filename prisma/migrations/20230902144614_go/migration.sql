/*
  Warnings:

  - You are about to drop the column `education` on the `Cv` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `Cv` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `Cv` table. All the data in the column will be lost.
  - You are about to drop the column `ownEducation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ownLanguages` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ownSkills` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ownStories` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CvField` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CvSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Source` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VacancySource` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('LABEL', 'TEXTAREA', 'NUMBER', 'DATE', 'SELECT');

-- DropForeignKey
ALTER TABLE "CvField" DROP CONSTRAINT "CvField_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "CvSection" DROP CONSTRAINT "CvSection_cvId_fkey";

-- DropForeignKey
ALTER TABLE "VacancySource" DROP CONSTRAINT "VacancySource_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "VacancySource" DROP CONSTRAINT "VacancySource_vacancyId_fkey";

-- AlterTable
ALTER TABLE "Cv" DROP COLUMN "education",
DROP COLUMN "languages",
DROP COLUMN "skills";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ownEducation",
DROP COLUMN "ownLanguages",
DROP COLUMN "ownSkills",
DROP COLUMN "ownStories",
ADD COLUMN     "educationId" TEXT;

-- DropTable
DROP TABLE "CvField";

-- DropTable
DROP TABLE "CvSection";

-- DropTable
DROP TABLE "Source";

-- DropTable
DROP TABLE "VacancySource";

-- CreateTable
CREATE TABLE "General" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "experienceYears" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "cvId" TEXT,

    CONSTRAINT "General_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "linkedIn" TEXT,
    "github" TEXT,
    "address" TEXT,
    "cvId" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cvId" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,
    "years" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "educationId" TEXT NOT NULL,

    CONSTRAINT "EducationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cvId" TEXT,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cvId" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomCvField" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "FieldType" NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT,
    "value" TEXT,
    "order" INTEGER NOT NULL,
    "sectionId" TEXT NOT NULL,
    "generalId" TEXT,
    "contactId" TEXT,

    CONSTRAINT "CustomCvField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomCvSection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,

    CONSTRAINT "CustomCvSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "General_cvId_key" ON "General"("cvId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_cvId_key" ON "Contact"("cvId");

-- CreateIndex
CREATE UNIQUE INDEX "Education_cvId_key" ON "Education"("cvId");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "General" ADD CONSTRAINT "General_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationEntry" ADD CONSTRAINT "EducationEntry_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomCvField" ADD CONSTRAINT "CustomCvField_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "CustomCvSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomCvField" ADD CONSTRAINT "CustomCvField_generalId_fkey" FOREIGN KEY ("generalId") REFERENCES "General"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomCvField" ADD CONSTRAINT "CustomCvField_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomCvSection" ADD CONSTRAINT "CustomCvSection_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
