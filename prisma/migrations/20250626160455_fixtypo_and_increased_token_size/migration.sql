/*
  Warnings:

  - You are about to drop the `AllowedServers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserServer` DROP FOREIGN KEY `UserServer_serverId_fkey`;

-- DropIndex
DROP INDEX `UserServer_serverId_fkey` ON `UserServer`;

-- AlterTable
ALTER TABLE `Account` MODIFY `access_token` TEXT NULL,
    MODIFY `id_token` TEXT NULL;

-- DropTable
DROP TABLE `AllowedServers`;

-- CreateTable
CREATE TABLE `AllowedServer` (
    `id` VARCHAR(191) NOT NULL,
    `serverIp` VARCHAR(191) NOT NULL,
    `discordServerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserServer` ADD CONSTRAINT `UserServer_serverId_fkey` FOREIGN KEY (`serverId`) REFERENCES `AllowedServer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
