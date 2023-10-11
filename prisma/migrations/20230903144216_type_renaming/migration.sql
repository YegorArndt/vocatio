/*
  Warnings:

  - You are about to drop the column `name` on the `CustomCvField` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `CustomCvField` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `CustomCvSection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vacancyId]` on the table `Cv` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `component` to the `CustomCvField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `component` to the `CustomCvSection` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SectionComponent" AS ENUM ('GENERAL', 'CONTACT', 'EDUCATION', 'SKILLS', 'LANGUAGES', 'CUSTOM');

-- CreateEnum
CREATE TYPE "FieldComponent" AS ENUM ('TEXT', 'TEXT_WITH_LABEL', 'TEXTAREA', 'TEXTAREA_WITH_LABEL', 'NUMBER', 'NUMBER_WITH_LABEL', 'DATE', 'DATE_WITH_LABEL', 'SELECT', 'SELECT_WITH_LABEL');

-- AlterTable
ALTER TABLE "CustomCvField" DROP COLUMN "name",
DROP COLUMN "type",
ADD COLUMN     "component" "FieldComponent" NOT NULL;

-- AlterTable
ALTER TABLE "CustomCvSection" DROP COLUMN "type",
ADD COLUMN     "component" "SectionComponent" NOT NULL;

-- DropEnum
DROP TYPE "FieldType";

-- DropEnum
DROP TYPE "SectionType";

-- CreateIndex
CREATE UNIQUE INDEX "Cv_vacancyId_key" ON "Cv"("vacancyId");
