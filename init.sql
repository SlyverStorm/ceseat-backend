
CREATE DATABASE IF NOT EXISTS dbusers;

CREATE USER IF NOT EXISTS 'msauth'@'localhost' IDENTIFIED BY 'msauthsecret';
GRANT ALL PRIVILEGES ON dbusers.* TO 'msauth'@'localhost';
FLUSH PRIVILEGES;

USE dbusers;

-- CreateTable
CREATE TABLE IF NOT EXISTS `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `Role` (`name`)
VALUES
(`customer`),
(`driver`),
(`restaurant`),
(`commercial`),
(`technical`);

-- CreateTable
CREATE TABLE IF NOT EXISTS `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(35) NOT NULL,
    `surname` VARCHAR(35) NOT NULL,
    `email` VARCHAR(320) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `image` VARCHAR(300) NULL,
    `isSuspended` BOOLEAN NOT NULL DEFAULT false,
    `roleId` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `Referent` (
    `id` VARCHAR(191) NOT NULL,
    `referentUserId` VARCHAR(191) NOT NULL,
    `newUserId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Referent_newUserId_key`(`newUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `Session` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `valid` BOOLEAN NOT NULL DEFAULT true,
    `userAgent` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referent` ADD CONSTRAINT `Referent_referentUserId_fkey` FOREIGN KEY (`referentUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referent` ADD CONSTRAINT `Referent_newUserId_fkey` FOREIGN KEY (`newUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

