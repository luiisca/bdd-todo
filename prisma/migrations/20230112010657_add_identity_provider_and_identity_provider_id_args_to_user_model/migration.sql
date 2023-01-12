-- AlterTable
ALTER TABLE `User` ADD COLUMN `identityProvider` ENUM('MAGIC', 'GOOGLE', 'GITHUB') NOT NULL DEFAULT 'GOOGLE',
    ADD COLUMN `identityProviderId` VARCHAR(191) NULL;
