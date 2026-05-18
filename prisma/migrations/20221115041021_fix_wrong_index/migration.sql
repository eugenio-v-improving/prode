/*
  Warnings:

  - A unique constraint covering the columns `[userId,prodeRoomId]` on the table `UserProde` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserProde_userId_prodeId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserProde_userId_prodeRoomId_key" ON "UserProde"("userId", "prodeRoomId");
