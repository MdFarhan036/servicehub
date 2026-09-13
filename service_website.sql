-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 20, 2026 at 06:06 PM
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
-- Database: `service_website`
--

-- --------------------------------------------------------

--
-- Table structure for table `about`
--

CREATE TABLE `about` (
  `id` int(11) NOT NULL,
  `hero_title` varchar(255) DEFAULT NULL,
  `hero_subtitle` text DEFAULT NULL,
  `hero_image` varchar(255) DEFAULT NULL,
  `intro_title` varchar(255) DEFAULT NULL,
  `intro_para1` text DEFAULT NULL,
  `intro_para2` text DEFAULT NULL,
  `intro_image` varchar(255) DEFAULT NULL,
  `stat1_number` varchar(100) DEFAULT NULL,
  `stat1_text` varchar(255) DEFAULT NULL,
  `stat2_number` varchar(100) DEFAULT NULL,
  `stat2_text` varchar(255) DEFAULT NULL,
  `stat3_number` varchar(100) DEFAULT NULL,
  `stat3_text` varchar(255) DEFAULT NULL,
  `stat4_number` varchar(100) DEFAULT NULL,
  `stat4_text` varchar(255) DEFAULT NULL,
  `mission` text DEFAULT NULL,
  `vision` text DEFAULT NULL,
  `value1_title` varchar(255) DEFAULT NULL,
  `value1_desc` text DEFAULT NULL,
  `value2_title` varchar(255) DEFAULT NULL,
  `value2_desc` text DEFAULT NULL,
  `value3_title` varchar(255) DEFAULT NULL,
  `value3_desc` text DEFAULT NULL,
  `value4_title` varchar(255) DEFAULT NULL,
  `value4_desc` text DEFAULT NULL,
  `cta_title` varchar(255) DEFAULT NULL,
  `cta_subtitle` text DEFAULT NULL,
  `cta_button_text` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL,
  `seo_schema` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT 'Admin',
  `short_description` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `publish_date` date DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `slug`, `category`, `author`, `short_description`, `content`, `image`, `publish_date`, `is_featured`, `seo_title`, `seo_description`, `seo_keywords`, `created_at`, `updated_at`) VALUES
(1, 'Different Types of Doors to Consider For Your Home', 'different-types-of-doors-to-consider-for-your-home', 'Ac Service', 'Admin', 'Explore different types of doors for your home including sliding, French, bi-fold, wooden, aluminium, steel, and glass doors. Learn how to choose the right door for style, security, and functionality.', '<div style=\"font-family:Arial,sans-serif; line-height:1.7; color:#333; max-width:900px; margin:auto;\">\r\n\r\n  <h1 style=\"font-size:32px; color:#222; margin-bottom:20px;\">\r\n    Different Types of Doors to Consider For Your Home\r\n  </h1>\r\n\r\n  <p style=\"font-size:16px; color:#555;\">\r\n    When designing your home, doors play a major role in security, style, privacy, and energy efficiency. \r\n    From modern sliding doors to traditional wooden doors, choosing the right door can improve both \r\n    functionality and aesthetics.\r\n  </p>\r\n\r\n  <h2 style=\"color:#111; margin-top:30px;\">\r\n    Types of Door Styles\r\n  </h2>\r\n\r\n  <h3 style=\"color:#444;\">1. Sliding Doors</h3>\r\n  <p>\r\n    Sliding doors are perfect for balconies, patios, and compact spaces. They move horizontally \r\n    on tracks and help save space while improving natural lighting.\r\n  </p>\r\n\r\n  <ul>\r\n    <li>Space-saving design</li>\r\n    <li>Large glass panels</li>\r\n    <li>Modern appearance</li>\r\n  </ul>\r\n\r\n  <h3 style=\"color:#444;\">2. French Doors</h3>\r\n  <p>\r\n    French doors add elegance and work well for gardens, balconies, and living areas.\r\n  </p>\r\n\r\n  <ul>\r\n    <li>Classic design</li>\r\n    <li>Better ventilation</li>\r\n    <li>Improved natural light</li>\r\n  </ul>\r\n\r\n  <h3 style=\"color:#444;\">3. Bi-Fold Doors</h3>\r\n  <p>\r\n    These doors fold in sections and are ideal for large openings.\r\n  </p>\r\n\r\n  <ul>\r\n    <li>Modern look</li>\r\n    <li>Space efficient</li>\r\n    <li>Great for outdoor access</li>\r\n  </ul>\r\n\r\n  <h3 style=\"color:#444;\">4. Flush Doors</h3>\r\n  <p>\r\n    Flush doors have smooth flat surfaces and are ideal for modern interiors.\r\n  </p>\r\n\r\n  <h3 style=\"color:#444;\">5. Pivot Doors</h3>\r\n  <p>\r\n    Pivot doors rotate on a central hinge and create a luxury entrance.\r\n  </p>\r\n\r\n  <h2 style=\"color:#111; margin-top:30px;\">\r\n    Door Materials\r\n  </h2>\r\n\r\n  <h3 style=\"color:#444;\">Wooden Doors</h3>\r\n  <p>\r\n    Wooden doors offer timeless beauty and warmth.\r\n  </p>\r\n\r\n  <h3 style=\"color:#444;\">Aluminium Doors</h3>\r\n  <p>\r\n    Lightweight, durable, and rust-resistant.\r\n  </p>\r\n\r\n  <h3 style=\"color:#444;\">Steel Doors</h3>\r\n  <p>\r\n    Perfect for security-focused homeowners.\r\n  </p>\r\n\r\n  <h3 style=\"color:#444;\">Glass Doors</h3>\r\n  <p>\r\n    Great for natural lighting and modern aesthetics.\r\n  </p>\r\n\r\n  <h2 style=\"color:#111; margin-top:30px;\">\r\n    How to Choose the Right Door\r\n  </h2>\r\n\r\n  <ul>\r\n    <li>Consider your available space</li>\r\n    <li>Match your home design style</li>\r\n    <li>Focus on durability</li>\r\n    <li>Check maintenance requirements</li>\r\n    <li>Set a practical budget</li>\r\n  </ul>\r\n\r\n  <h2 style=\"color:#111; margin-top:30px;\">\r\n    Conclusion\r\n  </h2>\r\n\r\n  <p>\r\n    The right door improves both functionality and beauty in your home. \r\n    Choose a design that fits your lifestyle, space requirements, and budget.\r\n  </p>\r\n\r\n</div>', '/uploads/1777486724087-245104061.jpg', '2026-04-29', 1, 'Different Types of Doors for Home | Best Door Designs & Materials', 'Learn about different types of doors for homes including sliding, French, wooden, aluminium, steel, and glass doors. Find the perfect door for your home.', 'types of doors, home door designs, sliding doors, french doors, wooden doors, aluminium doors, glass doors', '2026-04-29 18:18:44', '2026-04-29 18:18:44');

-- --------------------------------------------------------

--
-- Table structure for table `blog_page`
--

CREATE TABLE `blog_page` (
  `id` int(11) NOT NULL,
  `hero_title` varchar(255) DEFAULT NULL,
  `hero_subtitle` text DEFAULT NULL,
  `newsletter_title` varchar(255) DEFAULT NULL,
  `newsletter_subtitle` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `booking_date` date DEFAULT NULL,
  `booking_time` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `date` date DEFAULT NULL,
  `time` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `service_id`, `booking_date`, `booking_time`, `address`, `phone`, `notes`, `status`, `created_at`, `date`, `time`) VALUES
(1, 1, 1, NULL, NULL, NULL, NULL, NULL, 'completed', '2026-04-29 17:54:38', '2026-04-30', '00:23'),
(2, 7, 2, NULL, NULL, NULL, NULL, NULL, 'completed', '2026-04-29 19:38:28', '2026-04-30', '08:08');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `slug` varchar(255) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `canonical_url` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `image`, `created_at`, `slug`, `meta_title`, `meta_description`, `meta_keywords`, `canonical_url`, `description`) VALUES
(1, 'Ac Service', '/uploads/1777484841666-507632826.svg', '2026-04-29 17:47:21', 'ac-service', 'AC Service in Jaipur | AC Repair, Installation & Maintenance', 'Book professional AC services in Jaipur including AC repair, installation, gas refilling, cleaning, and maintenance at affordable prices. Fast doorstep service.', 'ac service jaipur, ac repair jaipur, ac installation service, ac gas refill, ac cleaning service, air conditioner repair', '', 'This is AC Repair'),
(2, 'Plumbing', '/uploads/1787240644800-671010399.png', '2026-08-20 15:44:04', 'plumbing', 'Plumbing', 'Plumbing description', 'Plumbing', '', 'Plumbing description');

-- --------------------------------------------------------

--
-- Table structure for table `category_page_content`
--

CREATE TABLE `category_page_content` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `about_title` varchar(255) DEFAULT NULL,
  `about_description` text DEFAULT NULL,
  `why_choose_title` varchar(255) DEFAULT NULL,
  `why_choose_description` text DEFAULT NULL,
  `faq_question_1` varchar(255) DEFAULT NULL,
  `faq_answer_1` text DEFAULT NULL,
  `faq_question_2` varchar(255) DEFAULT NULL,
  `faq_answer_2` text DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `rating` int(11) DEFAULT 5,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_approved` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `service_id`, `comment`, `rating`, `created_at`, `is_approved`) VALUES
(1, 1, 1, 'Good', 5, '2026-04-29 17:59:25', 1),
(2, 7, 2, 'Good', 5, '2026-04-29 19:38:38', 1);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `phone`, `message`, `created_at`) VALUES
(1, 'Md Farhan Arshad', 'mdfarhan2886@gmail.com', '07488210403', 'wef', '2026-04-30 18:21:27');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `question` varchar(500) NOT NULL,
  `answer` text NOT NULL,
  `sort_order` int(11) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'How quickly can I book a service?', 'You can book instantly through our platform and get service within hours.', 1, 1, '2026-04-29 18:13:39', '2026-04-29 18:13:39'),
(2, 'Do you provide AC repair services?', 'Yes, we provide AC repair, installation, cleaning, and maintenance services.', 2, 1, '2026-04-29 18:13:39', '2026-04-29 18:13:39');

-- --------------------------------------------------------

--
-- Table structure for table `highlights`
--

CREATE TABLE `highlights` (
  `id` int(11) NOT NULL,
  `value` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `highlights`
--

INSERT INTO `highlights` (`id`, `value`, `label`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '10K+', 'Happy Customers', 1, '2026-04-29 18:08:06', '2026-04-29 18:08:06'),
(2, '500+', 'Expert Professionals', 1, '2026-04-29 18:08:06', '2026-04-29 18:08:06'),
(3, '50+', 'Cities Served', 1, '2026-04-29 18:08:06', '2026-04-29 18:08:06'),
(4, '24/7', 'Customer Support', 1, '2026-04-29 18:08:06', '2026-04-29 18:08:06');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `images` longtext DEFAULT NULL,
  `is_popular` tinyint(1) DEFAULT 0,
  `is_daily_deal` tinyint(1) DEFAULT 0,
  `daily_deal_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `category_id`, `title`, `image`, `description`, `price`, `created_at`, `images`, `is_popular`, `is_daily_deal`, `daily_deal_price`) VALUES
(1, 1, 'AC repair and Service', NULL, '<div style=\"max-width:700px;margin:20px auto;font-family:Arial,sans-serif;border:1px solid #ddd;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.08);\">\r\n\r\n  <!-- Header -->\r\n  <div style=\"padding:20px;border-bottom:1px solid #eee;\">\r\n    <h2 style=\"margin:0;font-size:24px;color:#222;\">AC Lite Service</h2>\r\n    \r\n    <div style=\"margin-top:8px;font-size:16px;color:#555;\">\r\n      ⭐ <span style=\"font-weight:bold;\">4.6</span> \r\n      <span>(527 reviews)</span>\r\n    </div>\r\n\r\n    <div style=\"margin-top:12px;display:flex;justify-content:space-between;align-items:center;\">\r\n      <div style=\"font-size:24px;font-weight:bold;color:#000;\">\r\n        ₹599\r\n      </div>\r\n\r\n      <button style=\"background:#6a0dad;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-size:16px;cursor:pointer;\">\r\n        Add\r\n      </button>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- Close Button -->\r\n  <div style=\"text-align:right;padding:10px 20px;\">\r\n    <span style=\"font-size:22px;font-weight:bold;color:#666;cursor:pointer;\">✕</span>\r\n  </div>\r\n\r\n  <!-- Process Section -->\r\n  <div style=\"padding:20px;\">\r\n    <h3 style=\"margin-bottom:15px;font-size:20px;color:#222;\">Process</h3>\r\n\r\n    <div style=\"margin-bottom:15px;\">\r\n      <h4 style=\"margin:0;font-size:16px;color:#000;\">Basic Check</h4>\r\n      <p style=\"margin:5px 0;color:#666;font-size:14px;\">\r\n        Cooling and airflow are checked.\r\n      </p>\r\n    </div>\r\n\r\n    <div style=\"margin-bottom:15px;\">\r\n      <h4 style=\"margin:0;font-size:16px;color:#000;\">Indoor Cleaning</h4>\r\n      <p style=\"margin:5px 0;color:#666;font-size:14px;\">\r\n        Filters, coils, and drain area are cleaned.\r\n      </p>\r\n    </div>\r\n\r\n    <div style=\"margin-bottom:15px;\">\r\n      <h4 style=\"margin:0;font-size:16px;color:#000;\">Outdoor Cleaning</h4>\r\n      <p style=\"margin:5px 0;color:#666;font-size:14px;\">\r\n        Outer unit surface is cleaned (if accessible).\r\n      </p>\r\n    </div>\r\n\r\n    <div style=\"margin-bottom:20px;\">\r\n      <h4 style=\"margin:0;font-size:16px;color:#000;\">Final Test & Cleanup</h4>\r\n      <p style=\"margin:5px 0;color:#666;font-size:14px;\">\r\n        AC is tested and area cleaned.\r\n      </p>\r\n    </div>\r\n\r\n    <!-- Included -->\r\n    <h3 style=\"margin-bottom:10px;font-size:18px;color:green;\">Included</h3>\r\n    <ul style=\"padding-left:20px;color:#444;font-size:14px;line-height:1.8;\">\r\n      <li>For split and window ACs</li>\r\n      <li>Outdoor unit surface cleaning</li>\r\n    </ul>\r\n\r\n    <!-- Not Included -->\r\n    <h3 style=\"margin-top:20px;margin-bottom:10px;font-size:18px;color:red;\">\r\n      Not Included\r\n    </h3>\r\n    <ul style=\"padding-left:20px;color:#444;font-size:14px;line-height:1.8;\">\r\n      <li>Gas refill or leak repair</li>\r\n      <li>Deep/foam cleaning</li>\r\n      <li>Major part replacement</li>\r\n      <li>Electrical work</li>\r\n    </ul>\r\n  </div>\r\n</div>', 599.00, '2026-04-29 17:51:07', '[\"/uploads/1777485067790-894090851.svg\"]', 1, 1, 549.00),
(2, 1, 'Geyser Repair & Services in Jaipur', NULL, '<div style=\"font-family: Arial, sans-serif; max-width: 700px; margin: auto; border:1px solid #eee; border-radius:12px; overflow:hidden; background:#fff;\">\r\n\r\n  <!-- Header -->\r\n  <div style=\"padding:20px; border-bottom:1px solid #eee;\">\r\n    <h2 style=\"margin:0; font-size:24px; color:#222;\">\r\n      Geyser Cleaning Services\r\n    </h2>\r\n\r\n    <p style=\"margin:8px 0 0; color:#666; font-size:14px;\">\r\n      ⭐ 4.5 (66 reviews)\r\n    </p>\r\n  </div>\r\n\r\n  <!-- Packages -->\r\n  <div style=\"padding:20px; border-bottom:1px solid #eee;\">\r\n\r\n    <!-- Package 1 -->\r\n    <div style=\"display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px solid #f1f1f1;\">\r\n      <div>\r\n        <h3 style=\"margin:0; font-size:18px;\">Upto 10 Ltrs</h3>\r\n        <p style=\"margin:5px 0; color:#666;\">Upto 10 Ltrs</p>\r\n        <strong style=\"color:#000;\">₹549</strong>\r\n      </div>\r\n\r\n      <button style=\"padding:10px 25px; background:#6c2bd9; color:#fff; border:none; border-radius:8px; cursor:pointer;\">\r\n        Add\r\n      </button>\r\n    </div>\r\n\r\n    <!-- Package 2 -->\r\n    <div style=\"display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px solid #f1f1f1;\">\r\n      <div>\r\n        <h3 style=\"margin:0; font-size:18px;\">11 - 25 Ltrs</h3>\r\n        <p style=\"margin:5px 0; color:#666;\">11 - 25 Ltrs</p>\r\n        <strong style=\"color:#000;\">₹599</strong>\r\n      </div>\r\n\r\n      <button style=\"padding:10px 25px; background:#6c2bd9; color:#fff; border:none; border-radius:8px; cursor:pointer;\">\r\n        Add\r\n      </button>\r\n    </div>\r\n\r\n    <!-- Package 3 -->\r\n    <div style=\"display:flex; justify-content:space-between; align-items:center; padding:15px 0;\">\r\n      <div>\r\n        <h3 style=\"margin:0; font-size:18px;\">25 Ltrs +</h3>\r\n        <p style=\"margin:5px 0; color:#666;\">25 Ltrs +</p>\r\n        <strong style=\"color:#000;\">₹649</strong>\r\n      </div>\r\n\r\n      <button style=\"padding:10px 25px; background:#6c2bd9; color:#fff; border:none; border-radius:8px; cursor:pointer;\">\r\n        Add\r\n      </button>\r\n    </div>\r\n\r\n  </div>\r\n\r\n  <!-- Process Section -->\r\n  <div style=\"padding:20px; border-bottom:1px solid #eee;\">\r\n    <h3 style=\"margin-bottom:15px; color:#222;\">Process</h3>\r\n\r\n    <ul style=\"padding-left:20px; color:#555; line-height:1.8;\">\r\n      <li><strong>Unit inspection:</strong> We check for leaks, sounds, and heating performance.</li>\r\n      <li><strong>Scale removal & cleanup:</strong> Deposits are cleared for efficient heating.</li>\r\n      <li><strong>Outer body wipe-down:</strong> Exterior cleaned for a fresh look.</li>\r\n      <li><strong>Reassembly & testing:</strong> Geyser reinstalled and heating verified.</li>\r\n      <li><strong>Service warranty activation:</strong> Covered with a 30-day warranty.</li>\r\n    </ul>\r\n  </div>\r\n\r\n  <!-- Not Included -->\r\n  <div style=\"padding:20px;\">\r\n    <h3 style=\"margin-bottom:15px; color:#222;\">Not Included</h3>\r\n\r\n    <ul style=\"padding-left:20px; color:#555; line-height:1.8;\">\r\n      <li>Damaged heating element replacement</li>\r\n      <li>Electrical or wiring repairs</li>\r\n      <li>Gas geyser servicing</li>\r\n    </ul>\r\n  </div>\r\n\r\n</div>', 799.00, '2026-04-29 19:33:35', '[\"/uploads/1777491215303-190715925.png\"]', 1, 1, 799.00);

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image_url` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `designation`, `organization`, `message`, `image`, `sort_order`, `is_active`, `created_at`, `updated_at`, `image_url`, `seo_title`, `seo_description`, `seo_keywords`) VALUES
(1, 'Rahul Sharma', 'Homeowner', 'Jaipur', 'Excellent AC repair service with fast response and affordable pricing.', NULL, 1, 1, '2026-04-29 18:21:28', '2026-04-29 18:21:28', NULL, NULL, NULL, NULL),
(2, 'Rahul Sharma', 'Homeowner, Jaipur', 'G Edu', 'I booked AC repair service through this platform and the experience was excellent. The technician arrived on time, quickly diagnosed the issue, and fixed my air conditioner at an affordable price. Highly recommended for anyone looking for professional AC repair and home services in Jaipur.', '/uploads/1777487124594-510947667.jpg', 1, 1, '2026-04-29 18:25:24', '2026-04-29 18:25:24', NULL, 'Customer Testimonial | Best AC Repair Service in Jaipur', 'Read real customer reviews about our AC repair and home services in Jaipur. Trusted professionals, affordable pricing, and quick service.', 'ac repair testimonial, home service reviews, customer feedback jaipur, ac service review');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials_page`
--

CREATE TABLE `testimonials_page` (
  `id` int(11) NOT NULL,
  `hero_title` varchar(255) DEFAULT NULL,
  `hero_subtitle` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(20) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `phone`, `city`, `specialization`, `experience`, `status`) VALUES
(1, 'Rahul Sharma', 'rahul@gmail.com', '$2b$10$b7bFx8gEPNRqleP4vaXwaOHwXo4nXMtr9If2enMBKNVbdy2wBfn26', 'user', '2026-04-29 16:23:39', '8888881111', 'Jaipur', NULL, NULL, 'active'),
(2, 'Ramesh Plumber', 'plumber@gmail.com', '$2b$10$b7bFx8gEPNRqleP4vaXwaOHwXo4nXMtr9If2enMBKNVbdy2wBfn26', '', '2026-04-29 16:23:39', '7777771111', 'Jaipur', 'Plumbing', '4', 'active'),
(3, 'Suresh Electrician', 'electric@gmail.com', '$2b$10$b7bFx8gEPNRqleP4vaXwaOHwXo4nXMtr9If2enMBKNVbdy2wBfn26', '', '2026-04-29 16:23:39', '7777772222', 'Delhi', 'Electrical Repair', '6', 'active'),
(4, 'Vikas AC Repair', 'acrepair@gmail.com', '$2b$10$b7bFx8gEPNRqleP4vaXwaOHwXo4nXMtr9If2enMBKNVbdy2wBfn26', '', '2026-04-29 16:23:39', '7777773333', 'Mumbai', 'AC Repair', '5', 'active'),
(5, 'Cleaning Expert', 'cleaning@gmail.com', '$2b$10$b7bFx8gEPNRqleP4vaXwaOHwXo4nXMtr9If2enMBKNVbdy2wBfn26', '', '2026-04-29 16:23:39', '7777774444', 'Jaipur', 'Home Cleaning', '3', 'active'),
(7, 'Admin', 'admin@gmail.com', '$2b$10$l4os70EjGZxTpdSjyfBvKevSxIIPw/6QVHzM0JH1OEHnYgPUhVD1O', 'admin', '2026-04-29 16:24:14', NULL, NULL, NULL, NULL, 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about`
--
ALTER TABLE `about`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `blog_page`
--
ALTER TABLE `blog_page`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `category_page_content`
--
ALTER TABLE `category_page_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `highlights`
--
ALTER TABLE `highlights`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials_page`
--
ALTER TABLE `testimonials_page`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about`
--
ALTER TABLE `about`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blog_page`
--
ALTER TABLE `blog_page`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `category_page_content`
--
ALTER TABLE `category_page_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `highlights`
--
ALTER TABLE `highlights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `testimonials_page`
--
ALTER TABLE `testimonials_page`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `category_page_content`
--
ALTER TABLE `category_page_content`
  ADD CONSTRAINT `category_page_content_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
