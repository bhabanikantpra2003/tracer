/*
  Warnings:

  - A unique constraint covering the columns `[resettoken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_resettoken_key" ON "User"("resettoken");
