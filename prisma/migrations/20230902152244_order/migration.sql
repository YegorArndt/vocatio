/*
  Warnings:

  - Added the required column `order` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `General` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "General" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "order" INTEGER NOT NULL;
