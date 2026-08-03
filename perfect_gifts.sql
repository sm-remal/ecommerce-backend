-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 03, 2026 at 09:29 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `perfect_gifts`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` varchar(191) NOT NULL,
  `adminId` varchar(191) DEFAULT NULL,
  `adminName` varchar(191) NOT NULL,
  `action` enum('CREATE','UPDATE','DELETE','LOGIN','LOGOUT') NOT NULL,
  `module` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `ipAddress` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `adminId`, `adminName`, `action`, `module`, `description`, `ipAddress`, `createdAt`) VALUES
('cms74tj0u00012wvkvauj1jid', 'cms0eyjri0003z4tsap2tejhn', 'Admin', 'CREATE', 'Product', 'Admin created a new customized mug product', '::1', '2026-07-30 06:27:54.894');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `subtitle` varchar(191) DEFAULT NULL,
  `image` varchar(191) NOT NULL,
  `buttonText` varchar(191) DEFAULT NULL,
  `buttonLink` varchar(191) DEFAULT NULL,
  `position` enum('HERO','PROMO','SIDEBAR') NOT NULL DEFAULT 'HERO',
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `startAt` datetime(3) DEFAULT NULL,
  `expiryAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `subtitle`, `image`, `buttonText`, `buttonLink`, `position`, `sortOrder`, `isActive`, `startAt`, `expiryAt`, `createdAt`, `updatedAt`) VALUES
('cms30obww0000xcvkjpbi17oz', 'Updated Gift Banner', 'New offer for customized gifts.', 'https://res.cloudinary.com/demo/image/upload/banner-updated.jpg', 'View Offers', '/offers', 'PROMO', 1, 1, '2026-07-27 00:00:00.000', '2026-08-31 23:59:59.000', '2026-07-27 09:20:49.232', '2026-07-27 09:23:56.991');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `logo` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('ACTIVE','DRAFT','HIDDEN') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `seoId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `slug`, `logo`, `description`, `status`, `createdAt`, `updatedAt`, `seoId`) VALUES
('cms2u1bze0001e0vk4kv5gknh', 'Perfect Gifts', 'perfect-gifts', 'https://res.cloudinary.com/demo/image/upload/brand-logo.png', 'Premium customized gift brand.', 'ACTIVE', '2026-07-27 06:14:58.538', '2026-07-27 06:14:58.538', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `parentId` varchar(191) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `status` enum('ACTIVE','DRAFT','HIDDEN') NOT NULL DEFAULT 'ACTIVE',
  `metaTitle` varchar(191) DEFAULT NULL,
  `metaDescription` text DEFAULT NULL,
  `seoId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `parentId`, `sortOrder`, `status`, `metaTitle`, `metaDescription`, `seoId`, `createdAt`, `updatedAt`) VALUES
('cms2rg71h00001cvkwc8541hg', 'Premium Mugs', 'premium-mugs', 'Updated mug category', 'https://example.com/premium-mugs.jpg', NULL, 1, 'ACTIVE', 'Premium Mugs Category', 'Best premium mugs', NULL, '2026-07-27 05:02:33.125', '2026-07-27 05:03:03.520');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` varchar(191) NOT NULL,
  `code` varchar(80) NOT NULL,
  `type` enum('PERCENTAGE','FIXED') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `minOrderAmount` decimal(10,2) DEFAULT NULL,
  `maxDiscountAmount` decimal(10,2) DEFAULT NULL,
  `usageLimit` int(11) DEFAULT NULL,
  `usedCount` int(11) NOT NULL DEFAULT 0,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `type`, `value`, `minOrderAmount`, `maxDiscountAmount`, `usageLimit`, `usedCount`, `startDate`, `endDate`, `status`, `createdAt`, `updatedAt`) VALUES
('cms34khym0000vcvkusxl6wnz', 'EID25', 'PERCENTAGE', 25.00, 500.00, 350.00, 150, 0, '2026-07-27 00:00:00.000', '2026-08-31 23:59:59.000', 1, '2026-07-27 11:09:48.910', '2026-07-27 11:15:35.256');

-- --------------------------------------------------------

--
-- Table structure for table `discounts`
--

CREATE TABLE `discounts` (
  `id` varchar(191) NOT NULL,
  `name` varchar(120) NOT NULL,
  `type` enum('PERCENTAGE','FIXED') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discount_categories`
--

CREATE TABLE `discount_categories` (
  `discountId` varchar(191) NOT NULL,
  `categoryId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discount_products`
--

CREATE TABLE `discount_products` (
  `discountId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventories`
--

CREATE TABLE `inventories` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `lowStockThreshold` int(11) NOT NULL DEFAULT 3,
  `reservedQuantity` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_logs`
--

CREATE TABLE `inventory_logs` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `productName` varchar(191) NOT NULL,
  `type` enum('INCREASE','DECREASE','ADJUSTMENT') NOT NULL,
  `quantity` int(11) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `createdById` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `publicId` varchar(191) DEFAULT NULL,
  `type` enum('IMAGE','VIDEO','DOCUMENT') NOT NULL DEFAULT 'IMAGE',
  `fileName` varchar(191) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `uploadedById` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `url`, `publicId`, `type`, `fileName`, `size`, `uploadedById`, `createdAt`) VALUES
('cms7cxun700014wvkd7ofywmy', 'https://res.cloudinary.com/demo/image/upload/product-image.jpg', 'product-image', 'IMAGE', 'product-image.jpg', 245760, 'cms0eyjri0003z4tsap2tejhn', '2026-07-30 10:15:13.507');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(191) NOT NULL,
  `recipientId` varchar(191) DEFAULT NULL,
  `type` enum('ORDER','REVIEW','STOCK','COUPON','DISCOUNT','BANNER','SYSTEM') NOT NULL,
  `severity` enum('INFO','WARNING','CRITICAL') NOT NULL DEFAULT 'INFO',
  `title` varchar(160) NOT NULL,
  `message` text NOT NULL,
  `actionUrl` varchar(191) DEFAULT NULL,
  `sourceKey` varchar(191) DEFAULT NULL,
  `referenceId` varchar(191) DEFAULT NULL,
  `referenceLabel` varchar(191) DEFAULT NULL,
  `readAt` datetime(3) DEFAULT NULL,
  `dismissedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` varchar(191) NOT NULL,
  `orderRequestId` varchar(191) NOT NULL,
  `productId` varchar(191) DEFAULT NULL,
  `productName` varchar(191) NOT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_requests`
--

CREATE TABLE `order_requests` (
  `id` varchar(191) NOT NULL,
  `orderNumber` varchar(191) NOT NULL,
  `customerName` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `address` text NOT NULL,
  `message` text DEFAULT NULL,
  `channel` enum('WHATSAPP','MESSENGER','EMAIL_FORM') NOT NULL,
  `status` enum('PENDING','CONFIRMED','PROCESSING','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `estimatedTotal` decimal(10,2) DEFAULT NULL,
  `adminNote` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_requests`
--

INSERT INTO `order_requests` (`id`, `orderNumber`, `customerName`, `phone`, `email`, `address`, `message`, `channel`, `status`, `estimatedTotal`, `adminNote`, `createdAt`, `updatedAt`) VALUES
('cms72zxmm0000ewvkfz3k617s', 'CONTACT-1785389814491-1032', 'Rahim Uddin', '01712345678', 'rahim@example.com', 'Tongi, Gazipur', 'Subject: Custom mug order inquiry\n\nI want to know the price and delivery time for a custom photo mug.', 'EMAIL_FORM', 'PENDING', NULL, NULL, '2026-07-30 05:36:54.526', '2026-07-30 05:36:54.526'),
('cms730wfu0001ewvkgsnlzf4x', 'CONTACT-1785389859640-5191', 'Rahim Uddin', '01712345678', 'rahim@example.com', 'Tongi, Gazipur', 'Subject: Custom mug order inquiry\n\nI want to know the price and delivery time for a custom photo mug.', 'EMAIL_FORM', 'PENDING', NULL, NULL, '2026-07-30 05:37:39.643', '2026-07-30 05:37:39.643');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `tokenHash` varchar(191) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `usedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`id`, `userId`, `tokenHash`, `expiresAt`, `usedAt`, `createdAt`) VALUES
('cms06vy300001mctsn87fxb15', 'cms06hs6c0000scts69j30xrt', '7edcfd1ccdae071c1e9161511fd384573427a0aee6e70f57ce46cf4bc0a9decb', '2026-07-25 10:06:23.720', '2026-07-25 09:54:01.730', '2026-07-25 09:51:23.724');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `module` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `sku` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `shortDescription` varchar(191) DEFAULT NULL,
  `categoryId` varchar(191) NOT NULL,
  `brandId` varchar(191) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `salePrice` decimal(10,2) DEFAULT NULL,
  `costPrice` decimal(10,2) DEFAULT NULL,
  `discountType` enum('PERCENTAGE','FIXED') DEFAULT NULL,
  `discountValue` decimal(10,2) DEFAULT NULL,
  `discountStartAt` datetime(3) DEFAULT NULL,
  `discountEndAt` datetime(3) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `lowStockThreshold` int(11) NOT NULL DEFAULT 3,
  `stockStatus` enum('AVAILABLE','LOW_STOCK','OUT_OF_STOCK','COMING_SOON') NOT NULL DEFAULT 'AVAILABLE',
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `isTrending` tinyint(1) NOT NULL DEFAULT 0,
  `isNewArrival` tinyint(1) NOT NULL DEFAULT 0,
  `viewCount` int(11) NOT NULL DEFAULT 0,
  `metaTitle` varchar(191) DEFAULT NULL,
  `metaDescription` text DEFAULT NULL,
  `metaKeywords` varchar(191) DEFAULT NULL,
  `seoId` varchar(191) DEFAULT NULL,
  `createdById` varchar(191) DEFAULT NULL,
  `updatedById` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `altText` varchar(191) DEFAULT NULL,
  `isThumbnail` tinyint(1) NOT NULL DEFAULT 0,
  `sortOrder` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_tags`
--

CREATE TABLE `product_tags` (
  `productId` varchar(191) NOT NULL,
  `tagId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `customerName` varchar(120) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `roleId` varchar(191) NOT NULL,
  `permissionId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seo`
--

CREATE TABLE `seo` (
  `id` varchar(191) NOT NULL,
  `metaTitle` varchar(160) DEFAULT NULL,
  `metaDescription` varchar(320) DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `canonical` varchar(191) DEFAULT NULL,
  `ogImage` varchar(191) DEFAULT NULL,
  `robots` varchar(120) DEFAULT NULL,
  `jsonLd` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`jsonLd`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seo`
--

INSERT INTO `seo` (`id`, `metaTitle`, `metaDescription`, `keywords`, `canonical`, `ogImage`, `robots`, `jsonLd`, `createdAt`, `updatedAt`) VALUES
('cms2ycob6000000vk03qrtdj3', 'Customized Magic Mug | Perfect Gifts Station', 'Buy premium customized magic mug in Bangladesh from Perfect Gifts Station.', 'custom mug, magic mug, personalized gift, Bangladesh', 'https://yourdomain.com/products/customized-magic-mug', 'https://res.cloudinary.com/demo/image/upload/magic-mug-og.jpg', 'index,follow', '{\"@context\":\"https://schema.org\",\"@type\":\"Product\",\"name\":\"Customized Magic Mug\",\"brand\":\"Perfect Gifts Station\"}', '2026-07-27 08:15:46.194', '2026-07-27 08:15:46.194');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` varchar(191) NOT NULL DEFAULT 'settings',
  `siteName` varchar(191) NOT NULL,
  `logo` varchar(191) DEFAULT NULL,
  `favicon` varchar(191) DEFAULT NULL,
  `whatsappNumber` varchar(191) NOT NULL,
  `messengerLink` varchar(191) DEFAULT NULL,
  `facebookUrl` varchar(191) DEFAULT NULL,
  `instagramUrl` varchar(191) DEFAULT NULL,
  `tiktokUrl` varchar(191) DEFAULT NULL,
  `youtubeUrl` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `googleMapEmbed` text DEFAULT NULL,
  `businessHours` varchar(191) DEFAULT NULL,
  `footerText` text DEFAULT NULL,
  `gaId` varchar(191) DEFAULT NULL,
  `gscId` varchar(191) DEFAULT NULL,
  `fbPixelId` varchar(191) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `siteName`, `logo`, `favicon`, `whatsappNumber`, `messengerLink`, `facebookUrl`, `instagramUrl`, `tiktokUrl`, `youtubeUrl`, `email`, `phone`, `address`, `googleMapEmbed`, `businessHours`, `footerText`, `gaId`, `gscId`, `fbPixelId`, `updatedAt`) VALUES
('settings', 'Perfect Gifts Station', 'https://res.cloudinary.com/demo/image/upload/logo.png', 'https://res.cloudinary.com/demo/image/upload/favicon.ico', '01734584990', 'https://m.me/perfectgiftsstation', 'https://www.facebook.com/perfectgiftsstation', 'https://www.instagram.com/perfectgiftsstation', 'https://www.tiktok.com/@perfectgiftsstation', 'https://www.youtube.com/@perfectgiftsstation', 'perfectgiftsstation@gmail.com', '01734584990', 'Collate Gate, Tongi, Gazipur', '<iframe src=\"https://www.google.com/maps/embed?...\"></iframe>', 'Every day from 10:00 AM to 8:00 PM', 'Premium customized gifts made with care.', 'G-XXXXXXXXXX', 'google-site-verification-code', '1234567890', '2026-07-27 10:23:45.004');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `slug`) VALUES
('cms2uwfnm0001rcvktcwqa5uo', 'Magic Mug', 'magic-mug');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `avatar` varchar(191) DEFAULT NULL,
  `type` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `status` enum('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `emailVerifiedAt` datetime(3) DEFAULT NULL,
  `lastLogin` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `refreshTokenHash` varchar(191) DEFAULT NULL,
  `passwordChangedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `avatar`, `type`, `status`, `emailVerifiedAt`, `lastLogin`, `createdAt`, `updatedAt`, `refreshTokenHash`, `passwordChangedAt`) VALUES
('cms06hs6c0000scts69j30xrt', 'Shah Mozzem Remal', 'shahmozzemremal@gmail.com', '01518739165', '$2b$12$9OlyR81TjlmDnlxQE4HAku1p5.caV74KkMGI9gkVL5VgsQIDngiTy', NULL, 'ADMIN', 'ACTIVE', NULL, '2026-07-25 10:07:51.228', '2026-07-25 09:40:22.884', '2026-07-25 10:08:40.845', NULL, '2026-07-25 10:02:34.801'),
('cms06iux80001sctsdt0n2q1p', 'Shah Mozzem', 'shahmozzem@gmail.com', '01518739165', '$2b$12$aHGCw216OOCTvQohd673/epxwS4EGIqICl8VpCWfM3v56QGBIDn7O', NULL, 'USER', 'ACTIVE', NULL, NULL, '2026-07-25 09:41:13.101', '2026-07-25 09:41:13.327', '$2b$12$zx1H3tKOllrhqbAwu1WP7ef.bsgRn9FarFNax2JnNQsIiUIKOHTPO', NULL),
('cms06lipv0002scts5ys03v62', 'Shah Mozzem', 'shahmozzem1@gmail.com', '01518739165', '$2b$12$EChFNjyOeHSlVUTHBH8dV.KGJXU.LstNdHC.4FOASu.xYRKwZdGV6', NULL, 'USER', 'ACTIVE', NULL, NULL, '2026-07-25 09:43:17.251', '2026-07-25 09:43:17.478', '$2b$12$.IFgF4fc/M/5sEqOvNqDz.TjX81iaHwik0zJ4Ukn4OE3kgVpC80ty', NULL),
('cms06rgw20000mctsjojcdvtd', 'Shah Mozzem43', 'shahmozzem1343@gmail.com', '01518789165', '$2b$12$0KfYCl//XA6cBSPP22KoZulRmwNQSbvzzizmqTA.K6THRq3JUnNni', NULL, 'USER', 'ACTIVE', NULL, NULL, '2026-07-25 09:47:54.818', '2026-07-25 09:47:55.055', '$2b$12$uExKJsdx5mhsuAY6h6/qUegM1UZWXZLYjtPDwLCLZu1PDZGyc0lOW', NULL),
('cms073e2c0002mctsfxasp3j6', 'Shah Mozzem Remal5456', 'shahmoz445456zemremal@gmail.com', '01518739165', '$2b$12$kghkRSd/J1G/M7HFYITV4.dx/SkNbsjQDk7B5sRkqhXr5trO4B.Fu', NULL, 'USER', 'ACTIVE', NULL, NULL, '2026-07-25 09:57:11.028', '2026-07-25 09:57:11.256', '$2b$12$GUXDJX2BHGnjxba7QV0fxOrnURiTw1cDqhAJFN3PFYfCuPAOCeMDW', NULL),
('cms0ensqt0002z4tsyorwlusk', 'Remal', 'remal@gmail.com', '01518739162', '$2b$12$b.7AW2e7mF4YzU31vQa3eOxrkzrmMaULAedmP7yvV7rGPEF2nP1zS', NULL, 'USER', 'ACTIVE', NULL, '2026-07-25 13:33:13.089', '2026-07-25 13:29:00.485', '2026-07-25 13:33:13.317', '$2b$12$G7PYfDx8.5dHMK8Z1zBwDeQzJXvXTx9o1U10D6KVaD4wZwlSvr5VG', NULL),
('cms0eyjri0003z4tsap2tejhn', 'Admin', 'admin@gmail.com', '01933333333', '$2b$12$C29SBSHpUYzQm5IbTY92eu1OMZsNVe3.vvr0RfDRmOrQDNb.7igPq', 'https://example.com/uploads/my-profile.png', 'ADMIN', 'ACTIVE', NULL, '2026-07-30 10:55:21.200', '2026-07-25 13:37:22.062', '2026-07-30 10:55:21.442', '$2b$12$7qYU6aemmeXwoOnDMfNwWeL08CbXWZ4onSA9oO/EYRMbwJkWRoWm.', NULL),
('cms36wy570000d0vkl82hdkka', 'Rahim Uddin', 'rahim.user@example.com', '01711111111', '$2b$12$L689AUo1CVPU5G1K4G6Hv.x6KeIhl8HTbRHeWeZzNaCZ4WYgcm39C', 'https://example.com/uploads/rahim.png', 'USER', 'ACTIVE', NULL, NULL, '2026-07-27 12:15:28.987', '2026-07-27 12:15:28.987', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `userId` varchar(191) NOT NULL,
  `roleId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('1579c80a-fd1b-4584-bf6c-46a7a3b4035f', 'c3933c1e7ca6fa8fddece659d54369140b645b4a4328f97fe660c338827128e2', '2026-07-24 17:49:04.027', '20260724174902_init', NULL, NULL, '2026-07-24 17:49:02.152', 1),
('334aa270-9934-40fc-96ee-5f61996d7e87', '1069df1f379399d168cbdcc368dbce6b3ced2b99a7a366d18dbef6136a78a797', '2026-07-27 11:09:28.238', '20260727120000_add_coupons', NULL, NULL, '2026-07-27 11:09:28.210', 1),
('817973f7-b8a1-4622-b8ca-9f5497a0728f', '9af30940556ea63979f35e0712c0b5cb7487f44328d73f206c9a39070eb7cc69', '2026-07-25 08:59:35.825', '20260725090000_auth_tokens', NULL, NULL, '2026-07-25 08:59:35.759', 1),
('90d0e18f-dd62-4956-be1b-f353b3832a08', 'cf5d96fb67849ede8f6094b12ff1869e5feb580d17c6c92125c464c0591ee22a', '2026-08-03 07:10:59.911', '20260803120000_add_notifications', NULL, NULL, '2026-08-03 07:10:59.785', 1),
('b7c746fa-5dc1-4299-98df-8c0d5c29daca', '1216adff05aaf81e615b5e73e624094e013eae3df277bd5c8cb58f4c5d3e0ed9', '2026-07-27 11:39:34.633', '20260727123000_add_reviews', NULL, NULL, '2026-07-27 11:39:34.552', 1),
('bfb824cf-0448-47c5-a235-6813ed3679e6', '7574fe2799d7ca9164b703ace4eaa0d5874d27c5e0d51f31b4bcdbc3a2d608c6', '2026-07-25 13:27:36.683', '20260725093000_user_default_role', NULL, NULL, '2026-07-25 13:27:36.631', 1),
('ff7cc65e-74e8-4ba9-b29f-8d3184c0a23f', '84370b9f6b519e5e4f1f4393e14110a43a31bd0c679cf51c4ee5be9b4126641d', '2026-07-27 11:58:07.392', '20260727124500_add_wishlists', NULL, NULL, '2026-07-27 11:58:07.253', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_adminId_createdAt_idx` (`adminId`,`createdAt`),
  ADD KEY `activity_logs_module_action_idx` (`module`,`action`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `banners_position_isActive_sortOrder_idx` (`position`,`isActive`,`sortOrder`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `brands_slug_key` (`slug`),
  ADD KEY `brands_status_idx` (`status`),
  ADD KEY `brands_seoId_idx` (`seoId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_key` (`slug`),
  ADD KEY `categories_status_sortOrder_idx` (`status`,`sortOrder`),
  ADD KEY `categories_parentId_idx` (`parentId`),
  ADD KEY `categories_seoId_idx` (`seoId`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `coupons_code_key` (`code`),
  ADD KEY `coupons_status_startDate_endDate_idx` (`status`,`startDate`,`endDate`);

--
-- Indexes for table `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `discounts_startDate_endDate_idx` (`startDate`,`endDate`);

--
-- Indexes for table `discount_categories`
--
ALTER TABLE `discount_categories`
  ADD PRIMARY KEY (`discountId`,`categoryId`),
  ADD KEY `discount_categories_categoryId_fkey` (`categoryId`);

--
-- Indexes for table `discount_products`
--
ALTER TABLE `discount_products`
  ADD PRIMARY KEY (`discountId`,`productId`),
  ADD KEY `discount_products_productId_fkey` (`productId`);

--
-- Indexes for table `inventories`
--
ALTER TABLE `inventories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inventories_productId_key` (`productId`);

--
-- Indexes for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_logs_productId_idx` (`productId`),
  ADD KEY `inventory_logs_createdById_idx` (`createdById`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `media_uploadedById_idx` (`uploadedById`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `notifications_sourceKey_key` (`sourceKey`),
  ADD KEY `notifications_recipientId_readAt_dismissedAt_idx` (`recipientId`,`readAt`,`dismissedAt`),
  ADD KEY `notifications_type_severity_idx` (`type`,`severity`),
  ADD KEY `notifications_createdAt_idx` (`createdAt`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_orderRequestId_idx` (`orderRequestId`),
  ADD KEY `order_items_productId_idx` (`productId`);

--
-- Indexes for table `order_requests`
--
ALTER TABLE `order_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_requests_orderNumber_key` (`orderNumber`),
  ADD KEY `order_requests_status_createdAt_idx` (`status`,`createdAt`),
  ADD KEY `order_requests_phone_idx` (`phone`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `password_reset_tokens_tokenHash_key` (`tokenHash`),
  ADD KEY `password_reset_tokens_userId_expiresAt_idx` (`userId`,`expiresAt`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_key` (`name`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_slug_key` (`slug`),
  ADD UNIQUE KEY `products_sku_key` (`sku`),
  ADD KEY `products_categoryId_status_idx` (`categoryId`,`status`),
  ADD KEY `products_brandId_idx` (`brandId`),
  ADD KEY `products_status_isFeatured_idx` (`status`,`isFeatured`),
  ADD KEY `products_status_isTrending_idx` (`status`,`isTrending`),
  ADD KEY `products_status_isNewArrival_idx` (`status`,`isNewArrival`),
  ADD KEY `products_stockStatus_idx` (`stockStatus`),
  ADD KEY `products_seoId_idx` (`seoId`),
  ADD KEY `products_price_idx` (`price`),
  ADD KEY `products_createdById_fkey` (`createdById`),
  ADD KEY `products_updatedById_fkey` (`updatedById`);
ALTER TABLE `products` ADD FULLTEXT KEY `products_name_description_idx` (`name`,`description`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_images_productId_sortOrder_idx` (`productId`,`sortOrder`);

--
-- Indexes for table `product_tags`
--
ALTER TABLE `product_tags`
  ADD PRIMARY KEY (`productId`,`tagId`),
  ADD KEY `product_tags_tagId_fkey` (`tagId`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_productId_status_idx` (`productId`,`status`),
  ADD KEY `reviews_status_createdAt_idx` (`status`,`createdAt`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_key` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`roleId`,`permissionId`),
  ADD KEY `role_permissions_permissionId_fkey` (`permissionId`);

--
-- Indexes for table `seo`
--
ALTER TABLE `seo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tags_name_key` (`name`),
  ADD UNIQUE KEY `tags_slug_key` (`slug`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`userId`,`roleId`),
  ADD KEY `user_roles_roleId_fkey` (`roleId`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wishlists_userId_productId_key` (`userId`,`productId`),
  ADD KEY `wishlists_userId_createdAt_idx` (`userId`,`createdAt`),
  ADD KEY `wishlists_productId_idx` (`productId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `brands`
--
ALTER TABLE `brands`
  ADD CONSTRAINT `brands_seoId_fkey` FOREIGN KEY (`seoId`) REFERENCES `seo` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_seoId_fkey` FOREIGN KEY (`seoId`) REFERENCES `seo` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `discount_categories`
--
ALTER TABLE `discount_categories`
  ADD CONSTRAINT `discount_categories_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `discount_categories_discountId_fkey` FOREIGN KEY (`discountId`) REFERENCES `discounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `discount_products`
--
ALTER TABLE `discount_products`
  ADD CONSTRAINT `discount_products_discountId_fkey` FOREIGN KEY (`discountId`) REFERENCES `discounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `discount_products_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `inventories`
--
ALTER TABLE `inventories`
  ADD CONSTRAINT `inventories_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD CONSTRAINT `inventory_logs_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `inventory_logs_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_orderRequestId_fkey` FOREIGN KEY (`orderRequestId`) REFERENCES `order_requests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `products_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_seoId_fkey` FOREIGN KEY (`seoId`) REFERENCES `seo` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_tags`
--
ALTER TABLE `product_tags`
  ADD CONSTRAINT `product_tags_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_tags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_permissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlists_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
