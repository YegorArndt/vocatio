/*
  Warnings:

  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CvToLanguage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CvToSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LanguageToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LanguageToVacancy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SkillToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SkillToVacancy` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `languages` to the `Cv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skills` to the `Cv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownLanguages` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownSkills` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requiredLanguages` to the `Vacancy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requiredSkills` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CvToLanguage" DROP CONSTRAINT "_CvToLanguage_A_fkey";

-- DropForeignKey
ALTER TABLE "_CvToLanguage" DROP CONSTRAINT "_CvToLanguage_B_fkey";

-- DropForeignKey
ALTER TABLE "_CvToSkill" DROP CONSTRAINT "_CvToSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_CvToSkill" DROP CONSTRAINT "_CvToSkill_B_fkey";

-- DropForeignKey
ALTER TABLE "_LanguageToUser" DROP CONSTRAINT "_LanguageToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LanguageToUser" DROP CONSTRAINT "_LanguageToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_LanguageToVacancy" DROP CONSTRAINT "_LanguageToVacancy_A_fkey";

-- DropForeignKey
ALTER TABLE "_LanguageToVacancy" DROP CONSTRAINT "_LanguageToVacancy_B_fkey";

-- DropForeignKey
ALTER TABLE "_SkillToUser" DROP CONSTRAINT "_SkillToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SkillToUser" DROP CONSTRAINT "_SkillToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_SkillToVacancy" DROP CONSTRAINT "_SkillToVacancy_A_fkey";

-- DropForeignKey
ALTER TABLE "_SkillToVacancy" DROP CONSTRAINT "_SkillToVacancy_B_fkey";

-- AlterTable
ALTER TABLE "Cv" ADD COLUMN     "languages" TEXT NOT NULL,
ADD COLUMN     "skills" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ownLanguages" TEXT NOT NULL,
ADD COLUMN     "ownSkills" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "requiredLanguages" TEXT NOT NULL,
ADD COLUMN     "requiredSkills" TEXT NOT NULL;

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "Skill";

-- DropTable
DROP TABLE "_CvToLanguage";

-- DropTable
DROP TABLE "_CvToSkill";

-- DropTable
DROP TABLE "_LanguageToUser";

-- DropTable
DROP TABLE "_LanguageToVacancy";

-- DropTable
DROP TABLE "_SkillToUser";

-- DropTable
DROP TABLE "_SkillToVacancy";
