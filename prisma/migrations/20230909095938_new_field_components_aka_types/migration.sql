/*
  Warnings:

  - Made the column `label` on table `CustomCvField` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FieldComponent" ADD VALUE 'PHONE_NUMBER';
ALTER TYPE "FieldComponent" ADD VALUE 'ADDRESS';
ALTER TYPE "FieldComponent" ADD VALUE 'LOCATION';

-- AlterTable
ALTER TABLE "CustomCvField" ALTER COLUMN "label" SET NOT NULL;
