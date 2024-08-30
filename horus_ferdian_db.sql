-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 30, 2024 at 10:04 AM
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
-- Database: `horus_ferdian_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(60) NOT NULL,
  `nama` varchar(40) NOT NULL,
  `tanggal_daftar` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`, `nama`, `tanggal_daftar`) VALUES
(1, 'akun1', '$2b$10$z8ThXSZ.Zuxz8r3/iZ8sRuGo2cigYPiQeTPpvlWytw7ZcS001yeMy', 'akun1@gmail.com', 'akun1', '2024-08-30'),
(2, 'akun2', '$2b$10$vxMJZfMnEnZsM2iQqj2Dk.Yz0cvN1EjiBcRrzf/4CopAI9OrVirSq', 'akun2@gmail.com', 'akun2', '2024-08-30'),
(3, 'ferdian', '$2b$10$YcWsTq2hDcRM1rydKxBO..gVQqjiI1yd2l57B8ucXsY8/lqS9Z.Dy', 'ferdian@gmail.com', 'ferdian', '2024-08-30');

-- --------------------------------------------------------

--
-- Table structure for table `voucher`
--

CREATE TABLE `voucher` (
  `id` int(10) NOT NULL,
  `nama` varchar(35) NOT NULL,
  `foto` varchar(40) NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `status` enum('unclaim','claim') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `voucher`
--

INSERT INTO `voucher` (`id`, `nama`, `foto`, `kategori`, `status`) VALUES
(1, 'voucher1', 'foto.jpg', 'potongan', 'unclaim'),
(2, 'voucher2', 'foto.jpg', 'potongan', 'unclaim'),
(3, 'voucher3', 'foto.jpg', 'diskon', 'unclaim'),
(4, 'voucher4', 'foto.jpg', 'potongan', 'unclaim'),
(5, 'voucher5', 'foto.jpg', 'diskon', 'unclaim'),
(6, 'voucher6', 'foto.jpg', 'diskon', 'claim'),
(7, 'voucher7', 'foto.jpg', 'potongan', 'claim');

-- --------------------------------------------------------

--
-- Table structure for table `voucher_claim`
--

CREATE TABLE `voucher_claim` (
  `id` int(20) NOT NULL,
  `id_voucher` int(20) NOT NULL,
  `tanggal_claim` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `voucher_claim`
--

INSERT INTO `voucher_claim` (`id`, `id_voucher`, `tanggal_claim`) VALUES
(5, 6, '2024-08-29'),
(17, 7, '2024-08-30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `voucher_claim`
--
ALTER TABLE `voucher_claim`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_voucher` (`id_voucher`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `voucher`
--
ALTER TABLE `voucher`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `voucher_claim`
--
ALTER TABLE `voucher_claim`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `voucher_claim`
--
ALTER TABLE `voucher_claim`
  ADD CONSTRAINT `voucher_claim_ibfk_1` FOREIGN KEY (`id_voucher`) REFERENCES `voucher` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
