-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "heading" TEXT NOT NULL DEFAULT 'Contact',
ALTER COLUMN "order" SET DEFAULT 2;

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "heading" TEXT NOT NULL DEFAULT 'Education',
ALTER COLUMN "order" SET DEFAULT 3;

-- AlterTable
ALTER TABLE "General" ADD COLUMN     "heading" TEXT NOT NULL DEFAULT 'General',
ALTER COLUMN "order" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "heading" TEXT NOT NULL DEFAULT 'Languages',
ALTER COLUMN "order" SET DEFAULT 5;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "heading" TEXT NOT NULL DEFAULT 'Skills',
ALTER COLUMN "order" SET DEFAULT 4;
