-- CreateTable
CREATE TABLE `RandomFunny` (
    `id` VARCHAR(191) NOT NULL,
    `funnyText` VARCHAR(191) NOT NULL,
    `submittedByUserId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RandomFunny` ADD CONSTRAINT `RandomFunny_submittedByUserId_fkey` FOREIGN KEY (`submittedByUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
