-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `logo` TEXT NULL,
    `industry` VARCHAR(191) NULL,
    `foundedYear` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `companySize` VARCHAR(191) NULL,
    `primaryColor` VARCHAR(191) NULL,
    `secondaryColor` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `enableNotifications` BOOLEAN NOT NULL DEFAULT false,
    `emailDigestFrequency` VARCHAR(191) NOT NULL DEFAULT 'weekly',
    `notifyOnUserSignup` BOOLEAN NOT NULL DEFAULT true,
    `notifyOnPaymentReceived` BOOLEAN NOT NULL DEFAULT true,
    `notifyOnSystemUpdates` BOOLEAN NOT NULL DEFAULT true,
    `notifyOnSecurityAlerts` BOOLEAN NOT NULL DEFAULT true,
    `marketingEmails` BOOLEAN NOT NULL DEFAULT false,
    `enableTwoFactorAuth` BOOLEAN NOT NULL DEFAULT false,
    `passwordExpiryDays` INTEGER NOT NULL DEFAULT 90,
    `sessionTimeoutMinutes` INTEGER NOT NULL DEFAULT 60,
    `ipRestriction` BOOLEAN NOT NULL DEFAULT false,
    `allowedIpAddresses` TEXT NULL,
    `failedLoginAttempts` INTEGER NOT NULL DEFAULT 5,
    `securityLevel` VARCHAR(191) NOT NULL DEFAULT 'medium',
    `enableDataSharing` BOOLEAN NOT NULL DEFAULT false,
    `enableAnalytics` BOOLEAN NOT NULL DEFAULT true,
    `enableAutoBackup` BOOLEAN NOT NULL DEFAULT false,
    `dataRetentionPeriod` VARCHAR(191) NOT NULL DEFAULT '1year',
    `backupFrequency` VARCHAR(191) NOT NULL DEFAULT 'daily',
    `backupTime` VARCHAR(191) NULL,
    `encryptData` BOOLEAN NOT NULL DEFAULT true,
    `anonymizeUserData` BOOLEAN NOT NULL DEFAULT false,
    `defaultTheme` VARCHAR(191) NOT NULL DEFAULT 'system',
    `enableCustomBranding` BOOLEAN NOT NULL DEFAULT false,
    `dateFormat` VARCHAR(191) NOT NULL DEFAULT 'MM/DD/YYYY',
    `timeFormat` VARCHAR(191) NOT NULL DEFAULT '12hour',
    `defaultLanguage` VARCHAR(191) NOT NULL DEFAULT 'en',
    `defaultTimezone` VARCHAR(191) NOT NULL DEFAULT 'UTC',
    `showWelcomeMessage` BOOLEAN NOT NULL DEFAULT true,
    `compactMode` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Settings_companyId_key`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Operation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `config` JSON NULL,
    `companyId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Operation_companyId_type_key`(`companyId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Action` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `config` JSON NOT NULL,
    `operationId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Action_operationId_type_key`(`operationId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Settings` ADD CONSTRAINT `Settings_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Operation` ADD CONSTRAINT `Operation_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_operationId_fkey` FOREIGN KEY (`operationId`) REFERENCES `Operation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
