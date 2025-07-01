/*
  Warnings:

  - A unique constraint covering the columns `[sessionToken]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `sessionToken` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_sessionToken_key` ON `user`(`sessionToken`);
