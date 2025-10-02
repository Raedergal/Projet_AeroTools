-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_aeronefId_fkey`;

-- DropIndex
DROP INDEX `User_aeronefId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `aeronefId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_aeronefId_fkey` FOREIGN KEY (`aeronefId`) REFERENCES `Aeronef`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
