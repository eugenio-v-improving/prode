/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ProdeRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProdeRoom_name_key" ON "ProdeRoom"("name");
