/*
  Warnings:

  - Added the required column `expiredAt` to the `resetToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `resetToken` ADD COLUMN `expiredAt` VARCHAR(191) NOT NULL;
