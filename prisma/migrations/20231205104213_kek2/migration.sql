/*
  Warnings:

  - The `salaryCurrency` column on the `Vacancy` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'GBP', 'CAD', 'AUD');

-- AlterEnum
ALTER TYPE "SkillLevel" ADD VALUE 'NATIVE';

-- AlterTable
ALTER TABLE "Vacancy" ALTER COLUMN "numApplicants" SET DATA TYPE TEXT,
ALTER COLUMN "salaryMin" SET DATA TYPE TEXT,
ALTER COLUMN "salaryMax" SET DATA TYPE TEXT,
ALTER COLUMN "isAnnualSalary" SET DEFAULT false,
DROP COLUMN "salaryCurrency",
ADD COLUMN     "salaryCurrency" "Currency" DEFAULT 'USD',
ALTER COLUMN "requiredYearsMin" SET DATA TYPE TEXT,
ALTER COLUMN "requiredYearsMax" SET DATA TYPE TEXT;
