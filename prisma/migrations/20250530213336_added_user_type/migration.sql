-- AlterTable
ALTER TABLE `User` ADD COLUMN `usertype` ENUM('admin', 'user') NOT NULL DEFAULT 'user';
