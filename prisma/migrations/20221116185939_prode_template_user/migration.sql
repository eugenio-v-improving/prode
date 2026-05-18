-- DropForeignKey
ALTER TABLE "UserProde" DROP CONSTRAINT "UserProde_prodeRoomId_fkey";

-- AlterTable
ALTER TABLE "UserProde" ADD COLUMN     "template" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "prodeRoomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserProde" ADD CONSTRAINT "UserProde_prodeRoomId_fkey" FOREIGN KEY ("prodeRoomId") REFERENCES "ProdeRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
