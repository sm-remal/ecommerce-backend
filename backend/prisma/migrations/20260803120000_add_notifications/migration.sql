-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `recipientId` VARCHAR(191) NULL,
    `type` ENUM('ORDER', 'REVIEW', 'STOCK', 'COUPON', 'DISCOUNT', 'BANNER', 'SYSTEM') NOT NULL,
    `severity` ENUM('INFO', 'WARNING', 'CRITICAL') NOT NULL DEFAULT 'INFO',
    `title` VARCHAR(160) NOT NULL,
    `message` TEXT NOT NULL,
    `actionUrl` VARCHAR(191) NULL,
    `sourceKey` VARCHAR(191) NULL,
    `referenceId` VARCHAR(191) NULL,
    `referenceLabel` VARCHAR(191) NULL,
    `readAt` DATETIME(3) NULL,
    `dismissedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `notifications_sourceKey_key`(`sourceKey`),
    INDEX `notifications_recipientId_readAt_dismissedAt_idx`(`recipientId`, `readAt`, `dismissedAt`),
    INDEX `notifications_type_severity_idx`(`type`, `severity`),
    INDEX `notifications_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
