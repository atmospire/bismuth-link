-- CreateTable
CREATE TABLE `UserServer` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `serverId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserServer_userId_serverId_key`(`userId`, `serverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserServer` ADD CONSTRAINT `UserServer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserServer` ADD CONSTRAINT `UserServer_serverId_fkey` FOREIGN KEY (`serverId`) REFERENCES `AllowedServers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
