-- CreateTable
CREATE TABLE `Gray` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Gray_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GrayChalan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grayId` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `markedPaid` BOOLEAN NOT NULL DEFAULT false,
    `discount` DOUBLE NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DyeingChalan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dyeingId` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `markedPaid` BOOLEAN NOT NULL DEFAULT false,
    `discount` DOUBLE NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dyeing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Dyeing_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GrayPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `grayId` INTEGER NOT NULL,
    `chalanId` INTEGER NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'MODERATOR') NOT NULL DEFAULT 'MODERATOR',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DyeingPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `dyeingId` INTEGER NOT NULL,
    `chalanId` INTEGER NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `grayId` INTEGER NOT NULL,
    `gray_amount` DOUBLE NOT NULL,
    `gray_rate` DOUBLE NOT NULL,
    `gray_date` VARCHAR(191) NULL,
    `dyeingId` INTEGER NULL,
    `dyeing_date` VARCHAR(191) NULL,
    `dyeing_rate` DOUBLE NULL,
    `dyeing_amount` DOUBLE NULL,
    `delivery_status` ENUM('IN_MILL', 'IN_HOUSE', 'RUNNING') NULL,
    `dyeingChalanId` INTEGER NULL,
    `grayChalanId` INTEGER NULL,
    `total_defected` DOUBLE NULL,
    `customerChalanId` INTEGER NULL,
    `due_ask_rate` DOUBLE NULL,
    `due_sell_rate` DOUBLE NULL,
    `cash_ask_rate` DOUBLE NULL,
    `cash_sell_rate` DOUBLE NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinishedProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `color` VARCHAR(191) NULL,
    `colorCode` VARCHAR(191) NULL,
    `design` VARCHAR(191) NULL,
    `productId` INTEGER NOT NULL,
    `is_sold` BOOLEAN NOT NULL DEFAULT false,
    `customerProductId` INTEGER NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `previousDue` DOUBLE NOT NULL DEFAULT 0,

    UNIQUE INDEX `Customer_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerChalan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `paymentWithPurchaseId` INTEGER NULL,
    `date` VARCHAR(191) NOT NULL,
    `markedPaid` BOOLEAN NOT NULL DEFAULT false,
    `discount` DOUBLE NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `chalanId` INTEGER NOT NULL,
    `product_rate` DOUBLE NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `customerId` INTEGER NOT NULL,
    `customerChalanId` INTEGER NULL,
    `isPreviousPayment` BOOLEAN NOT NULL DEFAULT false,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyCash` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `previous` DOUBLE NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DailyCash_date_key`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CashIn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `dailyCashId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyOthersCost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `dailyCashId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerCheck` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `bank` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GrayChalan` ADD CONSTRAINT `GrayChalan_grayId_fkey` FOREIGN KEY (`grayId`) REFERENCES `Gray`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DyeingChalan` ADD CONSTRAINT `DyeingChalan_dyeingId_fkey` FOREIGN KEY (`dyeingId`) REFERENCES `Dyeing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GrayPayment` ADD CONSTRAINT `GrayPayment_grayId_fkey` FOREIGN KEY (`grayId`) REFERENCES `Gray`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GrayPayment` ADD CONSTRAINT `GrayPayment_chalanId_fkey` FOREIGN KEY (`chalanId`) REFERENCES `GrayChalan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DyeingPayment` ADD CONSTRAINT `DyeingPayment_dyeingId_fkey` FOREIGN KEY (`dyeingId`) REFERENCES `Dyeing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DyeingPayment` ADD CONSTRAINT `DyeingPayment_chalanId_fkey` FOREIGN KEY (`chalanId`) REFERENCES `DyeingChalan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_grayId_fkey` FOREIGN KEY (`grayId`) REFERENCES `Gray`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_dyeingId_fkey` FOREIGN KEY (`dyeingId`) REFERENCES `Dyeing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_dyeingChalanId_fkey` FOREIGN KEY (`dyeingChalanId`) REFERENCES `DyeingChalan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_grayChalanId_fkey` FOREIGN KEY (`grayChalanId`) REFERENCES `GrayChalan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_customerChalanId_fkey` FOREIGN KEY (`customerChalanId`) REFERENCES `CustomerChalan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinishedProduct` ADD CONSTRAINT `FinishedProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinishedProduct` ADD CONSTRAINT `FinishedProduct_customerProductId_fkey` FOREIGN KEY (`customerProductId`) REFERENCES `CustomerProduct`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerChalan` ADD CONSTRAINT `CustomerChalan_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerProduct` ADD CONSTRAINT `CustomerProduct_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerProduct` ADD CONSTRAINT `CustomerProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerProduct` ADD CONSTRAINT `CustomerProduct_chalanId_fkey` FOREIGN KEY (`chalanId`) REFERENCES `CustomerChalan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerPayment` ADD CONSTRAINT `CustomerPayment_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerPayment` ADD CONSTRAINT `CustomerPayment_customerChalanId_fkey` FOREIGN KEY (`customerChalanId`) REFERENCES `CustomerChalan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashIn` ADD CONSTRAINT `CashIn_dailyCashId_fkey` FOREIGN KEY (`dailyCashId`) REFERENCES `DailyCash`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyOthersCost` ADD CONSTRAINT `DailyOthersCost_dailyCashId_fkey` FOREIGN KEY (`dailyCashId`) REFERENCES `DailyCash`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerCheck` ADD CONSTRAINT `CustomerCheck_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
