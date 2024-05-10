-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2024 at 05:45 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `foodblees`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(100) NOT NULL,
  `provinceId` int(20) NOT NULL,
  `cityId` int(20) NOT NULL,
  `address` varchar(200) NOT NULL,
  `latitude` varchar(150) NOT NULL,
  `longitude` varchar(150) NOT NULL,
  `createdAt` varchar(150) NOT NULL,
  `updatedAt` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `id` int(11) NOT NULL,
  `provinceId` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`id`, `provinceId`, `name`) VALUES
(1, 1, 'Banda Aceh'),
(2, 1, 'Sabang'),
(3, 1, 'Lhokseumawe'),
(4, 1, 'langsa'),
(5, 1, 'Subulussalam'),
(6, 2, 'Binjai'),
(7, 2, 'Gunungsitoli'),
(8, 2, 'Medan'),
(9, 2, 'Padangsidimpuan'),
(10, 2, 'Pematangsiantar'),
(11, 2, 'Sibolga'),
(12, 2, 'Tanjungbalai'),
(13, 2, 'Tebing Tinggi'),
(14, 3, 'Padang'),
(15, 3, 'Bukittinggi'),
(16, 3, 'Padang Panjang'),
(17, 3, 'Pariaman'),
(18, 3, 'Payakumbuh'),
(19, 3, 'Sawahlunto'),
(20, 3, 'Solok'),
(21, 4, 'Lubuklinggau'),
(22, 4, 'Pagar Alam'),
(23, 4, 'Palembang'),
(24, 4, 'Prabumulih'),
(25, 5, 'Bengkulu'),
(26, 6, 'Dumai'),
(27, 6, 'Pekanbaru'),
(28, 7, 'Batam'),
(29, 7, 'Tanjungpinang'),
(30, 8, 'Sungai Penuh'),
(31, 8, 'Jambi'),
(32, 9, 'Bandar Lampung'),
(33, 9, 'Metro'),
(34, 10, 'Pangkalpinang'),
(35, 11, 'Pontianak'),
(36, 11, 'Singkawang'),
(37, 12, 'Balikpapan'),
(38, 12, 'Bontang'),
(39, 12, 'Samarinda'),
(40, 12, 'Nusantara'),
(41, 13, 'Banjarbaru'),
(42, 13, 'Banjarmasin'),
(43, 14, 'Palangka Raya'),
(44, 15, 'Tarakan'),
(45, 16, 'Cilegon'),
(46, 16, 'Serang'),
(47, 16, 'Tangerang'),
(48, 16, 'Tangerang Selatan'),
(49, 17, 'Kota Administrasi Jakarta Barat'),
(50, 17, 'Kota Administrasi Jakarta Pusat'),
(51, 17, 'Kota Administrasi Jakarta Selatan'),
(52, 17, 'Kota Administrasi Jakarta Utara'),
(53, 18, 'Bandung'),
(54, 18, 'Bekasi'),
(55, 18, 'Bogor'),
(56, 18, 'Cimahi'),
(57, 18, 'Cirebon'),
(58, 18, 'Depok'),
(59, 18, 'Sukabumi'),
(60, 18, 'Tasikmalaya'),
(61, 18, 'Banjar'),
(62, 19, 'Magelang'),
(63, 19, 'Pekalongan'),
(64, 19, 'Salatiga'),
(65, 19, 'Semarang'),
(66, 19, 'Surakarta'),
(67, 19, 'Tegal'),
(68, 20, 'Batu'),
(69, 20, 'Blitar'),
(70, 20, 'Kediri'),
(71, 20, 'Madiun'),
(72, 20, 'Malang'),
(73, 20, 'Mojokerto'),
(74, 20, 'Pasuruan'),
(75, 20, 'Probolinggo'),
(76, 20, 'Surabaya'),
(77, 21, 'Denpasar'),
(78, 22, 'Kupang'),
(79, 23, 'Bima'),
(80, 23, 'Mataram'),
(81, 24, 'Gorontalo'),
(82, 25, 'Majene'),
(83, 26, 'Palu'),
(84, 27, 'Bitung'),
(85, 27, 'Kotamobagu'),
(86, 27, 'Manado'),
(87, 27, 'Tomohon'),
(88, 28, 'Bau-Bau'),
(89, 28, 'Kendari'),
(90, 29, 'Makassar'),
(91, 29, 'Palopo'),
(92, 29, 'Parepare'),
(93, 30, 'Ternate'),
(94, 30, 'Tidore Kepulauan'),
(95, 31, 'Ambon'),
(96, 31, 'Tual'),
(97, 32, 'Sorong'),
(98, 33, 'Jayapura'),
(99, 33, 'Wamena'),
(100, 34, 'Timika'),
(101, 35, 'Merauke'),
(102, 36, 'Fakfak');

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `id` varchar(100) NOT NULL,
  `sellerId` varchar(100) NOT NULL,
  `name` varchar(150) NOT NULL,
  `price` int(25) NOT NULL,
  `stock` int(20) NOT NULL,
  `photo` varchar(250) NOT NULL,
  `createdAt` varchar(100) NOT NULL,
  `updatedAt` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`id`, `sellerId`, `name`, `price`, `stock`, `photo`, `createdAt`, `updatedAt`) VALUES
('eKgoEeLvAB6bFMf9', 'mXzLJ85yTx_53R_6', 'uhuy', 100000, -1, '1714291968229-Screenshot_6.png', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `orderfood`
--

CREATE TABLE `orderfood` (
  `id` int(11) NOT NULL,
  `foodId` varchar(100) NOT NULL,
  `sellerId` varchar(150) NOT NULL,
  `userId` varchar(100) NOT NULL,
  `amount` varchar(100) NOT NULL,
  `price` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `createdAt` varchar(100) NOT NULL,
  `updatedAt` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orderfood`
--

INSERT INTO `orderfood` (`id`, `foodId`, `sellerId`, `userId`, `amount`, `price`, `status`, `createdAt`, `updatedAt`) VALUES
(0, 'eKgoEeLvAB6bFMf9', 'mXzLJ85yTx_53R_6', 'MrprcBRlY7lfJo7x', '2', '0', 'dipesan', '2024-04-29T06:58:06.346Z', '2024-04-29T06:58:06.346Z'),
(0, 'eKgoEeLvAB6bFMf9', 'mXzLJ85yTx_53R_6', 'MrprcBRlY7lfJo7x', '2', '0', 'dipesan', '2024-04-29T06:59:42.552Z', '2024-04-29T06:59:42.552Z'),
(0, 'eKgoEeLvAB6bFMf9', 'mXzLJ85yTx_53R_6', 'MrprcBRlY7lfJo7x', '2', '0', 'dipesan', '2024-04-29T07:00:22.004Z', '2024-04-29T07:00:22.004Z'),
(0, 'eKgoEeLvAB6bFMf9', 'mXzLJ85yTx_53R_6', 'MrprcBRlY7lfJo7x', '2', '200000', 'dipesan', '2024-04-29T07:02:38.451Z', '2024-04-29T07:02:38.451Z'),
(0, 'eKgoEeLvAB6bFMf9', 'mXzLJ85yTx_53R_6', 'MrprcBRlY7lfJo7x', '2', '200000', 'dipesan', '2024-04-29T07:15:12.641Z', '2024-04-29T07:15:12.641Z'),
(7, 'eKgoEeLvAB6bFMf9', 'mXzLJ85yTx_53R_6', 'MrprcBRlY7lfJo7x', '1', '100000', 'dipesan', '2024-04-29T07:15:35.712Z', '2024-04-29T07:15:35.712Z'),
(0, 'eKgoEeLvAB6bFMf9', 'mXzLJ85yTx_53R_6', 'MrprcBRlY7lfJo7x', '1', '100000', 'dipesan', '2024-04-29T07:17:54.260Z', '2024-04-29T07:17:54.260Z');

-- --------------------------------------------------------

--
-- Table structure for table `province`
--

CREATE TABLE `province` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `province`
--

INSERT INTO `province` (`id`, `name`) VALUES
(1, 'Aceh'),
(2, 'Sumatera Utara'),
(3, 'Sumatera Barat'),
(4, 'Sumatera Selatan'),
(5, 'Bengkulu'),
(6, 'Riau'),
(7, 'Kepulauan Riau'),
(8, 'Jambi'),
(9, 'Lampung'),
(10, 'Kepulauan Bangka Belitung'),
(11, 'Kalimantan Barat'),
(12, 'Kalimantan Timur'),
(13, 'Kalimantan Selatan'),
(14, 'Kalimantan Tengah'),
(15, 'Kalimantan Utara'),
(16, 'Banten'),
(17, 'DKI Jakarta'),
(18, 'Jawa Barat'),
(19, 'Jawa Tengah'),
(20, 'DI Yogyakarta'),
(21, 'Jawa Timur'),
(22, 'Bali'),
(23, 'Nusa Tenggara Timur'),
(24, 'Nusa Tenggara Barat'),
(25, 'Gorontalo'),
(26, 'Sulawesi Barat'),
(27, 'Sulawesi Tengah'),
(28, 'Sulawesi Utara'),
(29, 'Sulawesi Tenggara'),
(30, 'Sulawesi Selatan'),
(31, 'Maluku Utara'),
(32, 'Maluku'),
(33, 'Papua Barat'),
(34, 'Papua'),
(35, 'Papua Pegunungan'),
(36, 'Papua Selatan'),
(37, 'Papua Barat Daya');

-- --------------------------------------------------------

--
-- Table structure for table `seller`
--

CREATE TABLE `seller` (
  `id` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(100) NOT NULL,
  `provinceId` int(20) NOT NULL,
  `cityId` int(20) NOT NULL,
  `address` varchar(200) NOT NULL,
  `latitude` varchar(50) NOT NULL,
  `longitude` varchar(50) NOT NULL,
  `createdAt` varchar(100) NOT NULL,
  `updatedAt` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `seller`
--

INSERT INTO `seller` (`id`, `email`, `password`, `name`, `provinceId`, `cityId`, `address`, `latitude`, `longitude`, `createdAt`, `updatedAt`) VALUES
('cy2qDVlR1TcmUW7h', 'akun@gmail.com', '$2b$10$Ndza/3byI9Nrx2OR3pt/y.dnyVXjKzvh.XLokD9Z3m4mCGz2Nvm6q', 'toko kue daffa', 0, 0, 'bandung', '20', '20', '', ''),
('HxV9zBZqtjDH63jA', 'akun2@gmail.com', '$2b$10$WJSZ7Emv4Vbb2kNG2Em5besl8K7FwUuW6YkgECuzjYWl2x98GhGd2', 'toko kue cicak', 0, 0, 'bandung', '20', '20', '', ''),
('mXzLJ85yTx_53R_6', 'afsa@gmail.com', '$2b$10$gZ/VrVu/239IkREJBxwt5eB6y9FMOlfHYowqu41QJeNj59xgEXnW6', 'afsa', 0, 0, 'bandung', '20', '20', '', ''),
('JTb5jDVDRQIe9ewr', 'sellerafsa@gmail.com', '$2b$10$1nW8yonbKfWMr5VSCZTF/epJGK8KojJI6ULnWsOaNtMFB.bIF.tRe', 'afsa', 1, 1, 'aceh kota', '20', '30', '2024-05-10T02:41:44.566Z', '2024-05-10T02:41:44.566Z'),
('NCLU7sNp3vPYtzqq', 'sellerafsa2@gmail.com', '$2b$10$fO5Y.CGFeWmKts3Td.1SoeYB7gaeezynCfzsn/rUguh/ZadhZQeOm', 'afsa', 1, 1, 'aceh kota', '20', '30', '2024-05-10T02:43:12.046Z', '2024-05-10T02:43:12.046Z');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(100) NOT NULL,
  `provinceId` int(20) NOT NULL,
  `cityId` int(20) NOT NULL,
  `address` varchar(100) NOT NULL,
  `latitude` varchar(100) NOT NULL,
  `longitude` varchar(100) NOT NULL,
  `createdAt` varchar(100) NOT NULL,
  `updatedAt` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `provinceId`, `cityId`, `address`, `latitude`, `longitude`, `createdAt`, `updatedAt`) VALUES
('W4aPZIcT5xW8Uulk', 'user@gmail.com', '$2b$10$fjsQn61D2IrEggIYgaY/reTcOkr0H0.W78YfgEMCQvbSkvGYjg/OS', 'user', 0, 0, 'jakarta', '20', '30', '', ''),
('MrprcBRlY7lfJo7x', 'user2@gmail.com', '$2b$10$N../QIr2.bTWE3zEfTLW0uXNmyQdkbvFJVGfPDZI9K3TNEzV4zKcS', 'user', 0, 0, 'jakarta', '20', '30', '2024-04-28T15:12:04.700Z', '2024-04-28T15:12:04.700Z'),
('_vNatB6VGkUq8wTD', 'kornel@gmail.com', '$2b$10$tILCTuHEFRG3Psrt3lehZeMfbNl0XyWRILXUEgQ6D8uVVHvaIQV9.', 'kornel', 18, 15, 'Bandung', '30', '20', '2024-05-10T02:29:18.611Z', '2024-05-10T02:29:18.611Z'),
('P8uFehX3ySQbnB1A', 'kornel3@gmail.com', '$2b$10$lblRyXz2QiAWdqDKMmZTR.tKfUSmDN2cA1XkKfjgE3wBXk2nHYspW', 'kornel', 18, 15, 'Bandung', '30', '20', '2024-05-10T02:36:24.389Z', '2024-05-10T02:36:24.389Z');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`id`),
  ADD KEY `provinceId` (`provinceId`);

--
-- Indexes for table `province`
--
ALTER TABLE `province`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `province`
--
ALTER TABLE `province`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `city`
--
ALTER TABLE `city`
  ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`provinceId`) REFERENCES `province` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
