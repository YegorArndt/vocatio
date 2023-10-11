/*
  Warnings:

  - You are about to drop the column `contactId` on the `CustomCvField` table. All the data in the column will be lost.
  - You are about to drop the column `generalId` on the `CustomCvField` table. All the data in the column will be lost.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Education` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EducationEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `General` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `value` on table `CustomCvField` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `type` to the `CustomCvSection` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LanguageLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('GENERAL', 'CONTACT', 'EDUCATION', 'SKILLS', 'LANGUAGES', 'CUSTOM');

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_cvId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_userId_fkey";

-- DropForeignKey
ALTER TABLE "CustomCvField" DROP CONSTRAINT "CustomCvField_contactId_fkey";

-- DropForeignKey
ALTER TABLE "CustomCvField" DROP CONSTRAINT "CustomCvField_generalId_fkey";

-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_cvId_fkey";

-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_userId_fkey";

-- DropForeignKey
ALTER TABLE "EducationEntry" DROP CONSTRAINT "EducationEntry_educationId_fkey";

-- DropForeignKey
ALTER TABLE "General" DROP CONSTRAINT "General_cvId_fkey";

-- DropForeignKey
ALTER TABLE "General" DROP CONSTRAINT "General_userId_fkey";

-- DropForeignKey
ALTER TABLE "Language" DROP CONSTRAINT "Language_cvId_fkey";

-- DropForeignKey
ALTER TABLE "Language" DROP CONSTRAINT "Language_userId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_cvId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_userId_fkey";

-- AlterTable
ALTER TABLE "CustomCvField" DROP COLUMN "contactId",
DROP COLUMN "generalId",
ALTER COLUMN "value" SET NOT NULL;

-- AlterTable
ALTER TABLE "CustomCvSection" ADD COLUMN     "type" "SectionType" NOT NULL;

-- DropTable
DROP TABLE "Contact";

-- DropTable
DROP TABLE "Education";

-- DropTable
DROP TABLE "EducationEntry";

-- DropTable
DROP TABLE "General";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "Skill";
