-- AlterTable
ALTER TABLE "User" ADD COLUMN     "background" TEXT NOT NULL DEFAULT 'background-1',
ADD COLUMN     "dark" BOOLEAN NOT NULL DEFAULT false;
