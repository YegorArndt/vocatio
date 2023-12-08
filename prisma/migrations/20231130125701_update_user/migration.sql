/*
  Warnings:

  - You are about to drop the column `images` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `objectives` on the `User` table. All the data in the column will be lost.
  - Added the required column `image` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "glassdoor" TEXT,
ADD COLUMN     "hh" TEXT,
ADD COLUMN     "indeed" TEXT,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "github" DROP NOT NULL,
ALTER COLUMN "linkedin" DROP NOT NULL,
ALTER COLUMN "facebook" DROP NOT NULL,
ALTER COLUMN "instagram" DROP NOT NULL,
ALTER COLUMN "twitter" DROP NOT NULL,
ALTER COLUMN "telegram" DROP NOT NULL,
ALTER COLUMN "skype" DROP NOT NULL,
ALTER COLUMN "vk" DROP NOT NULL,
ALTER COLUMN "website" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "zip" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "images",
DROP COLUMN "objectives",
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "objective" TEXT;
