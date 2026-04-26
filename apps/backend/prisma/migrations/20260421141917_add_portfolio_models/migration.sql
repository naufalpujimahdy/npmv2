-- AlterTable
ALTER TABLE `contententry` MODIFY `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    MODIFY `locale` VARCHAR(191) NOT NULL DEFAULT 'id';

-- AlterTable
ALTER TABLE `project` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'completed';

-- CreateTable
CREATE TABLE `ApiLog` (
    `id` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
