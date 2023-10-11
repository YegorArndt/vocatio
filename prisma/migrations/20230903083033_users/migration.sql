/*
  Warnings:

  - The values [LABEL] on the enum `FieldType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `order` to the `Story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownEmail` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FieldType_new" AS ENUM ('TEXT', 'TEXT_WITH_LABEL', 'TEXTAREA', 'TEXTAREA_WITH_LABEL', 'NUMBER', 'NUMBER_WITH_LABEL', 'DATE', 'DATE_WITH_LABEL', 'SELECT', 'SELECT_WITH_LABEL');
ALTER TABLE "CustomCvField" ALTER COLUMN "type" TYPE "FieldType_new" USING ("type"::text::"FieldType_new");
ALTER TYPE "FieldType" RENAME TO "FieldType_old";
ALTER TYPE "FieldType_new" RENAME TO "FieldType";
DROP TYPE "FieldType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "addressOrder" INTEGER,
ADD COLUMN     "emailOrder" INTEGER,
ADD COLUMN     "githubOrder" INTEGER,
ADD COLUMN     "linkedInOrder" INTEGER,
ADD COLUMN     "phoneOrder" INTEGER;

-- AlterTable
ALTER TABLE "General" ADD COLUMN     "countryOrder" INTEGER,
ADD COLUMN     "experienceYearsOrder" INTEGER,
ALTER COLUMN "experienceYears" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "ownEmail" TEXT NOT NULL,
ADD COLUMN     "ownPhone" TEXT;
