/*
  Warnings:

  - You are about to drop the `_categorytodiscount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_discounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_discounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_specifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_categorytodiscount` DROP FOREIGN KEY `_CategoryToDiscount_A_fkey`;

-- DropForeignKey
ALTER TABLE `_categorytodiscount` DROP FOREIGN KEY `_CategoryToDiscount_B_fkey`;

-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_userId_fkey`;

-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_productId_fkey`;

-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_userId_fkey`;

-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `order_discounts` DROP FOREIGN KEY `order_discounts_discountId_fkey`;

-- DropForeignKey
ALTER TABLE `order_discounts` DROP FOREIGN KEY `order_discounts_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_productId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_billingAddressId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_shippingAddressId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_userId_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `product_discounts` DROP FOREIGN KEY `product_discounts_discountId_fkey`;

-- DropForeignKey
ALTER TABLE `product_discounts` DROP FOREIGN KEY `product_discounts_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product_images` DROP FOREIGN KEY `product_images_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product_specifications` DROP FOREIGN KEY `product_specifications_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product_variants` DROP FOREIGN KEY `product_variants_productId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_productId_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_userId_fkey`;

-- DropTable
DROP TABLE `_categorytodiscount`;

-- DropTable
DROP TABLE `addresses`;

-- DropTable
DROP TABLE `cart`;

-- DropTable
DROP TABLE `categories`;

-- DropTable
DROP TABLE `discounts`;

-- DropTable
DROP TABLE `order_discounts`;

-- DropTable
DROP TABLE `order_items`;

-- DropTable
DROP TABLE `orders`;

-- DropTable
DROP TABLE `payments`;

-- DropTable
DROP TABLE `product_discounts`;

-- DropTable
DROP TABLE `product_images`;

-- DropTable
DROP TABLE `product_specifications`;

-- DropTable
DROP TABLE `product_variants`;

-- DropTable
DROP TABLE `products`;

-- DropTable
DROP TABLE `reviews`;

-- DropTable
DROP TABLE `store_settings`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'customer',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `image` VARCHAR(191) NULL,
    `additionalImages` JSON NOT NULL,
    `categoryId` INTEGER NULL,
    `color` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `inStock` BOOLEAN NOT NULL DEFAULT true,
    `specs` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `totalAmount` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `deliveryAddress` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
