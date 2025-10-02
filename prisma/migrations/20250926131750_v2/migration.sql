/*
  Warnings:

  - Added the required column `aeronefId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `aeronefId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Aeronef` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `immat` VARCHAR(5) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_aeronefId_fkey` FOREIGN KEY (`aeronefId`) REFERENCES `Aeronef`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
