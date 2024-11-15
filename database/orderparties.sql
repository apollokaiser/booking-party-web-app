-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 22, 2023 at 03:03 AM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `orderparties`
--

DELIMITER $$
--
-- Functions
--
DROP FUNCTION IF EXISTS `insertDataAndGetId`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `insertDataAndGetId` (`serviceId` VARCHAR(10)) RETURNS INT  BEGIN
	INSERT INTO menu(serviceID) VALUES(serviceId);
  #  DECLARE last_insert_id INT ;
   # SET last_insert_id = LAST_INSERT_ID();
    RETURN LAST_INSERT_ID();
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admin_user`
--

DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE IF NOT EXISTS `admin_user` (
  `admin_id` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã nhân viên',
  `USERNAME` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'tên tài khoản nhân viên',
  `PASSWORD` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'mật khẩu đăng nhập',
  `EMAIL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'email của nhân viên',
  `PHONE` int DEFAULT NULL COMMENT 'Số điện thoại nhân viên',
  `LASTNAME` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Họ của nhân viên',
  `FIRSTNAME` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên của nhân viên',
  `IMAGE` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ADDRESS` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa chỉ của nhân viên',
  `CREATE_AT` date NOT NULL COMMENT 'Ngày vào làm',
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_user`
--

INSERT INTO `admin_user` (`admin_id`, `USERNAME`, `PASSWORD`, `EMAIL`, `PHONE`, `LASTNAME`, `FIRSTNAME`, `IMAGE`, `ADDRESS`, `CREATE_AT`) VALUES
('DH52003194', 'dh52003194', '13102002', 'ngothinh@gmail.com', NULL, 'Ngo', 'Thinh', '', '180, Cao Lo', '2023-10-31');

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

DROP TABLE IF EXISTS `bill`;
CREATE TABLE IF NOT EXISTS `bill` (
  `billID` char(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderID` char(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billTotal` double NOT NULL,
  `billBonus` double NOT NULL,
  `adminID` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billDate` date DEFAULT NULL,
  PRIMARY KEY (`billID`),
  UNIQUE KEY `orderID` (`orderID`),
  KEY `FK_ADMINUSER_BILL` (`adminID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bill`
--

INSERT INTO `bill` (`billID`, `orderID`, `billTotal`, `billBonus`, `adminID`, `billDate`) VALUES
('1703213663', '036965532927', 5260000, 1000000, 'DH52003194', '2023-12-22');

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

DROP TABLE IF EXISTS `food`;
CREATE TABLE IF NOT EXISTS `food` (
  `foodID` int NOT NULL AUTO_INCREMENT COMMENT 'Mã thức ăn',
  `foodName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên thức ăn',
  `price` double NOT NULL COMMENT 'Giá tiền của thức ăn',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả về thức ăn',
  `singlePartCount` int DEFAULT NULL COMMENT 'Số lượng phần thức ăn trên mỗi bàn',
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'đơn vị tính',
  `image` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `typeID` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại thức ăn phục vụ (Tráng miệng, Khai vị...)',
  `CreateAt` date NOT NULL COMMENT 'Ngày nhập gần nhất',
  PRIMARY KEY (`foodID`),
  KEY `FK_TYPEFOOD_FOOD` (`typeID`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`foodID`, `foodName`, `price`, `description`, `singlePartCount`, `unit`, `image`, `typeID`, `CreateAt`) VALUES
(1, ' súp hải sản hột gà', 200000, 'Đẳng cấp thế giới', NULL, NULL, 'sup-hai-san-trung.jpg', 'KV', '2023-11-17'),
(2, 'Gỏi ngó sen tôm thịt', 300000, '', NULL, NULL, 'goi-tom-thit.jpg', 'KV', '2023-11-17'),
(3, 'Nai né', 300000, '', NULL, NULL, 'nai-ne.jpg', 'AC', '2023-11-17'),
(4, 'Bò nấu tiêu xanh', 300000, '', NULL, NULL, 'bo-nau-tieu-xanh.jpg', 'AC', '2023-11-17'),
(5, 'Lẩu thái hải sản', 400000, '', NULL, NULL, 'lau-thai-hai-san.jpg', 'AC', '2023-11-17'),
(6, 'Rau câu', 80000, '', NULL, NULL, 'rau-cau.jpg', 'TM', '2023-11-17'),
(7, 'Súp hải sản trứng cút', 200000, '', NULL, NULL, 'sup-hai-san-trung.jpg', 'KV', '2023-11-17'),
(8, 'Gỏi củ hủ dừa tôm thịt', 300000, '', NULL, NULL, 'goi-hu-dua-tom-thit.jpg', 'KV', '2023-11-17'),
(9, 'Bò né', 300000, '', NULL, NULL, 'bo-ne.jpg', 'AC', '2023-11-17'),
(10, 'Mực hấp hành gừng', 350000, '', NULL, NULL, 'muc-hap-gung.jpg', 'AC', '2023-11-17'),
(11, 'Lẩu hải sản tươi sống', 400000, '', NULL, NULL, 'lau-hai-san.jpg', 'AC', '2023-11-17'),
(12, 'Trái cây thập cẩm', 100000, '', NULL, NULL, 'trai-cay-thap-cam.jpg', 'TM', '2023-11-17'),
(13, 'Soup bắp cua gà xé', 200000, '', NULL, NULL, 'soup-cua-ga-xe.jpg', 'KV', '2023-11-17'),
(14, 'Gỏi bò tái chanh', 300000, '', NULL, NULL, 'goi-tien-vua-tom-thi.jpg', 'KV', '2023-11-17'),
(15, 'Mực hấp gừng', 350000, '', NULL, NULL, 'muc-hap-gung.jpg', 'AC', '2023-11-17'),
(16, 'Diêu hồng chiên xù', 300000, '', NULL, NULL, 'dieu-hong-chien-xu.jpg', 'AC', '2023-11-17'),
(17, 'Lẩu thái hải sản chua cay', 400000, '', NULL, NULL, 'dieu-hong-chien-xu.jpg', 'AC', '2023-11-17'),
(18, 'Rau câu dừa', 80000, '', NULL, NULL, 'rau-cau-dua.jpg', 'TM', '2023-11-17'),
(19, 'Chả giò hải sản', 250000, '', NULL, NULL, 'cha-gio-hai-san.jpg', 'KV', '2023-11-17'),
(20, 'Giò heo nấu giả cầy', 350000, '', NULL, NULL, 'gio-heo-nau-da-cay.jpg', 'AC', '2023-11-17'),
(21, 'Lá lách bò hấp tía tô', 350000, '', NULL, NULL, 'la-sach-bo-hap-tia-to.jpg', 'AC', '2023-11-17'),
(22, 'Lẩu ếch lá giang + bún', 400000, '', NULL, NULL, 'lau-ech.jpg', 'AC', '2023-11-17'),
(23, 'ốc bưu nhồi thịt', 400000, '', NULL, NULL, 'Mon-oc-buu.png', 'KV', '2023-11-17'),
(24, 'Chả bò gân + Nai nướng lá lốt', 300000, '', NULL, NULL, 'nai-nuong-la-lot.jpg', 'KV', '2023-11-17'),
(25, 'Gỏi bò bóp thấu + bánh phồng', 300000, '', NULL, NULL, 'goi-bo-bop-thau.jpg', 'KV', '2023-11-17'),
(26, 'Lẩu đầu cá hồi măng chua', 400000, '', NULL, NULL, 'lau-ca-hoi.jpg', 'AC', '2023-11-17'),
(27, 'Bò xào lăn + bánh mỳ', 300000, '', NULL, NULL, 'bo-xao-lan.jpg', 'AC', '2023-11-17'),
(28, 'Gà hấp lá chanh - Xôi', 400000, '', NULL, NULL, 'ga-hap-la-chanh.jpg', 'AC', '2023-11-17'),
(29, 'Lẩu cá diêu hồng - Bún', 400000, '', NULL, NULL, 'lau-ca-dieu-hong.jpg', 'AC', '2023-11-17'),
(30, 'Nho mỹ', 150000, '', NULL, NULL, 'nho-my.jpg', 'TM', '2023-11-17'),
(31, 'Chả giò sầu riêng + Tôm lăm bột chiên cốm', 300000, '', NULL, NULL, 'cha-gio-sau-rieng.jpg', 'KV', '2023-11-17'),
(32, 'Giỏi nai bóp thấu + Bánh phòng', 300000, '', NULL, NULL, 'goi-nai-bop-thau.jpg', 'KV', '2023-11-17'),
(33, 'Lẩu nấm hải sản', 400000, '', NULL, NULL, 'lau-nam-hai-san.jpg', 'AC', '2023-11-17'),
(34, 'Mực xào sa tế', 350000, '', NULL, NULL, 'muc-xao-sa-te.jpg', 'AC', '2023-11-17'),
(35, 'Tôm sú hấp bia', 400000, '', NULL, NULL, 'tom-hap-bia.jpg', 'AC', '2023-11-17'),
(36, 'Tai tượng chiên xù cuốn bánh tráng', 350000, '', NULL, NULL, 'tai-tuong-chien-xua.jpg', 'AC', '2023-11-17'),
(37, 'Lẩu thập cẩm', 400000, '', NULL, NULL, 'lau-thap-cam.jpg', 'AC', '2023-11-17'),
(38, 'Tôm chiên cốm xanh + Cá trứng chiên giòn', 300000, '\n', NULL, NULL, 'tom-chien-com.jpg', 'KV', '2023-11-17'),
(39, 'Lẩu khổ qua cá thác lác', 400000, '', NULL, NULL, 'lau-kho-hoa-thac-lac.jpg', 'AC', '2023-11-17'),
(40, 'Tôm lăn bột chiên giòn + Mực lăn bột chiên cốm', 300000, '', NULL, NULL, 'tom-lan-bot-chien-gion.jpg', 'KV', '2023-11-17'),
(41, 'Gà bó xôi chiên', 450000, '', NULL, NULL, 'ga-boi-xoi.jpg', 'AC', '2023-11-17'),
(42, 'Rau câu lá dứa', 80000, '', NULL, NULL, 'rau-cau-la-dua.jpg', 'TM', '2023-11-17'),
(43, 'Nộm tai heo', 300000, '', NULL, NULL, 'nom-tai-heo.jpg', 'KV', '2023-11-17'),
(44, 'Cá lóc chiên xù cuốn bánh tráng', 350000, '', NULL, NULL, 'ca-loc-chien-xu.jpg', 'AC', '2023-11-17'),
(45, 'Vịt nấu giả cầy', 350000, '', NULL, NULL, 'vit-nau-gia-cay.jpg', 'AC', '2023-11-17'),
(46, 'Mực ống hấp hành gừng', 350000, '', NULL, NULL, 'muc-trung-hap-hanh.jpg', 'AC', '2023-11-17'),
(47, 'Giò heo nấu măng', 400000, '', NULL, NULL, 'gio-heo-nau-mang.jpg', 'AC', '2023-11-17'),
(48, 'Giò heo muối chiên giòn', 350000, '', NULL, NULL, 'gio-heo-muoi-chien.jpg', 'AC', '2023-11-18'),
(49, 'a', 100000, '', NULL, NULL, 'sup-hai-san-trung.jpg', 'AC', '2023-11-18');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
CREATE TABLE IF NOT EXISTS `menu` (
  `menuID` int NOT NULL AUTO_INCREMENT COMMENT 'Mã thực đơn',
  `menuName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tên thực đơn',
  `serviceID` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã loại dịch vụ tiệc',
  PRIMARY KEY (`menuID`),
  KEY `FK_SERVICES_MENU` (`serviceID`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`menuID`, `menuName`, `serviceID`) VALUES
(32, 'Thực đơn 1', 'TMT'),
(33, 'Thực đơn 2', 'TC'),
(34, 'Thực đơn 3', 'TC');

--
-- Triggers `menu`
--
DROP TRIGGER IF EXISTS `trigg_insert_menu`;
DELIMITER $$
CREATE TRIGGER `trigg_insert_menu` BEFORE INSERT ON `menu` FOR EACH ROW BEGIN
	DECLARE tong_dong int DEFAULT 0;
	SELECT count(*) +1 INTO tong_dong from menu;
    SET NEW.menuName = CONCAT('Thực đơn ', tong_dong);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `menudetail`
--

DROP TABLE IF EXISTS `menudetail`;
CREATE TABLE IF NOT EXISTS `menudetail` (
  `menuID` int NOT NULL COMMENT 'Mã thực đơn',
  `foodID` int NOT NULL COMMENT 'Mã thức ăn',
  PRIMARY KEY (`menuID`,`foodID`),
  KEY `FK_FOOD_MENUDETAIL` (`foodID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menudetail`
--

INSERT INTO `menudetail` (`menuID`, `foodID`) VALUES
(33, 1),
(33, 2),
(32, 3),
(32, 6),
(33, 6),
(33, 9),
(34, 9),
(33, 10),
(32, 12),
(33, 12),
(34, 13),
(32, 16),
(32, 17),
(32, 22),
(34, 25),
(32, 31),
(32, 33),
(32, 34),
(32, 42),
(34, 42);

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
CREATE TABLE IF NOT EXISTS `news` (
  `news_id` int NOT NULL AUTO_INCREMENT COMMENT 'Mã tin tức',
  `news_title` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề của tin tức',
  `news_hastag` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'thông điệp của tin tức',
  `news_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'nội dung của tin tức',
  `admin_id` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã nhân viên',
  `serviceID` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại dịch vụ ',
  `image` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CreateAt` date NOT NULL COMMENT 'Ngày tạo tin tức',
  PRIMARY KEY (`news_id`),
  KEY `FK_ADMIN_NEWS` (`admin_id`),
  KEY `FK_SERVICES_NEWS` (`serviceID`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`news_id`, `news_title`, `news_hastag`, `news_content`, `admin_id`, `serviceID`, `image`, `CreateAt`) VALUES
(66, 'TẠI SAO BẠN NÊN ĐẶT DỊCH VỤ NẤU TIỆC TẠI NHÀ', '#tiecnau#tainha', 'Mỗi gia đình hàng năm có quá nhiều bữa tiệc, nhưng vì tính chất công việc và xã hội ngày càng có xu hướng bận rộn hơn nên mọi người không thể nào dành toàn tâm, toàn lực, toàn thời gian cho mỗi bữa tiệc được. Hơn hết, khâu chuẩn bị lại là công đoạn mất rất nhiều thời gian, vì vậy mà để tận hưởng được các bữa tiệc trọn vẹn thì mọi người đang có xu hướng đặt các dịch vụ nấu tiệc tại nhà nhiều hơn.', 'DH52003194', 'TK', 'thuc-don-tiec-tat-nien-cong-ty.jpg', '2023-12-21'),
(67, 'BẠN CẦN ĐẶT TIỆC TẠI NHÀ KHU VỰC BÌNH DƯƠNG, HỒ CHÍ MINH', '', 'Bạn đang cần tiệc cho gia đình, bạn bè và người thân, hãy liên hệ ngay cho chúng tôi, Dattiec24h luôn sẵn sàng phục vụ bạn với đa dạng loại tiệc: tiệc cưới, tiệc tân gia,tiệc sinh nhật, tiệc liên hoan, ... Gọi ngay 0906.651.828 ', 'DH52003194', 'TC', 'tiec-cuoi-2.jpg', '2023-12-21'),
(68, 'DỊCH VỤ ĐẶT TIỆC ĐÁM GIỖ TẠI NHÀ TRỌN GÓI GIÁ RẺ HỒ CHÍ MINH.', '', 'Đám giỗ là một sự kiện không thể thiếu trong mỗi gia đình, ngoài việc để tưởng nhớ, biết ơn tổ tiên, còn là nơi để con cháu tụ họp quây quần bên nhau giúp gắn kết các thành viên trong gia đình, dòng họ. Vì thế, trong mỗi dịp đám giỗ ngoài việc cúng bái tổ tiên, còn có một phần tiệc để mọi người cùng ăn uống, trò chuyện bên nhau sau những ngày tháng làm việc miệt mài nay cùng được họp mặt vui vẻ.', 'DH52003194', 'TK', 'mam-co-sinh-nhat-44554.jpg', '2023-12-21'),
(69, 'MENU CHẤT LỪ CHO BỮA TIỆC CƯỚI HOÀNH TRÁNG', '', 'Chọn menu là một phần không thể thiếu cho mỗi bữa tiệc, ngoài việc lên menu phù hợp với phong cách tiệc thì khẩu vị mỗi món ăn cũng cần được xem xét sao cho phù hợp với đối tượng khách mời trong bữa tiệc. Vậy nên ngoài nhiều bữa tiệc khác nhau thì một bữa tiệc cưới hoành tráng cũng cần chọn lữa kỹ càng menu phù hợp.', 'DH52003194', 'TK', 'nau-tiec-tan-gia(1).jpg', '2023-12-21'),
(70, 'DỊCH VỤ TIỆC TÂN GIA TRỌN GÓI BÌNH DƯƠNG', '', 'Bạn đang chuẩn bị bữa tiệc tân gia hoành tráng và trọn vẹn mừng cột mốc ý nghĩa nhất khi bạn có ngôi nhà mơ ước đầu tiên của mình. Hãy liên hệ ngay Dattiec24h để chúng tôi có thể hỗ trợ và tư vấn cho bạn mọi khâu trong bữa tiệc.', 'DH52003194', 'TN', 'dc9891c3f4f919a740e8.jpg', '2023-12-21'),
(71, '3 Ý THƯỞNG TỔ CHỨC TIỆC THÔI NÔI TẠI NHÀ THỦ ĐỨC', '', 'Thôi nôi là ngày sinh nhật đầu tiên của mỗi người sau 1 năm chào đời. Vì vậy tiệc thôi nôi cũng là buổi tiệc rất quan trọng, không chỉ là một bữa tiệc chúc mừng từ người thân, bạn bè dành cho gia đình và em bé, mà còn là để cảm ơn đấng tâm linh đã gia hộ và bảo vệ cho em bé của gia đình. Vì thế mà hầu hết bữa tiệc thôi nôi được tổ chức rất trọn vẹn và là ngày không thể thiếu đối với gia đình có bé tròn 1 tuổi.Vậy bạn đã có ý tưởng tổ chức tiệc thôi nôi cho em bé của mình như thế nào chưa? Hãy để Dattiec24h gợi ý cho bạn nhé!', 'DH52003194', 'TC', '119703143_694132794520678_1159341575127400074_n.jpg', '2023-12-21'),
(72, 'TIỆC LIÊN HOAN 30/4, 1/5 VÀ GIỖ TỔ HÙNG VƯƠNG 2023', '', 'Lễ 30/4, 1/5 và giỗ tổ Hùng Vương sắp tới bạn đã có kế hoạch gì chưa? Thông thường vào những ngày lễ thì Dattiec24h luôn bận rộn phục vụ với những bữa tiệc liên hoan mừng lễ của bạn bè và gia đình. Nếu bạn cũng đang có kế hoạch tổ chức một buổi tiệc liên hoan nhỏ dành cho gia đình, người thân và bạn bè thì hay liên hệ ngay Dattiec24h nhé!', 'DH52003194', 'TKT', '111d70db4a6ea030f97f.jpg', '2023-12-21'),
(73, 'DỊCH VỤ TIỆC CƯỚI TẠI NHÀ TRỌN GÓI HỒ CHÍ MINH, BÌNH DƯƠNG, ĐỒNG NAI', '', 'Bạn đang cần tìm một đơn vị tổ chức tiệc cưới trọn gói chất lượng với giá cả phải chăng cùng sự phục vụ nhiệt tình, chu đáo? Hãy liên hệ ngay cho Dattiec24h, chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 với dịch vụ tiệc cưới trọn gói tại nhà khu vực Hồ Chí Minh, Bình Dương và Đồng Nai', 'DH52003194', 'TC', '1-dich-vu-nau-tiec-tai-nha (1).jpg', '2023-12-21'),
(74, 'DỊCH VỤ NẤU TIỆC TẠI NHÀ DĨ AN, THUẬN AN, BÌNH DƯƠNG', '', 'Mỗi năm chúng ta sẽ có rất nhiều bữa tiệc khác nhau, có buổi tiệc được mời tham dự, nhưng cũng có nhiều buổi tiệc chúng ta là chủ nhà. Tuy nhiên, công việc tất bật nên chúng ta khó mà tổ chức hay nấu được bữa tiệc hoàn chỉnh, do đó mà dịch vụ nấu tiệc tại nhà ra đời để giúp quý khách hàng có những bữa tiệc ngon, chất lượng và ý nghĩa nhất. Vậy muốn đặt tiệc nấu tại nhà Dĩ An, Thuận An, Bình Dương như thế nào? ', 'DH52003194', 'TC', '1-dich-vu-nau-tiec-tai-nha (1).jpg', '2023-12-21'),
(75, 'ĐẶT TIỆC TÂN GIA TRỌN GÓI QUẬN GÒ VẤP, HỒ CHÍ MINH', '#tiecnau', 'Tiệc tân gia nhà mới được xem là một bữa tiệc của gia chủ khi họ vừa chuyển qua nhà mới hoặc xây xong căn nhà, bữa tiệc này với các mong muốn như một phần muốn gửi thông báo đến cho tất cả người thân, bạn bè vừa là một dịp tốt để cho họ có thể chia sẻ niềm vui đối với tất cả gia chủ.', 'DH52003194', 'TDH', 'dat-tiec-tai-nha-1.jpg', '2023-12-21');

--
-- Triggers `news`
--
DROP TRIGGER IF EXISTS `insert_data_trigger`;
DELIMITER $$
CREATE TRIGGER `insert_data_trigger` BEFORE INSERT ON `news` FOR EACH ROW BEGIN
  IF EXISTS (SELECT * FROM `news` WHERE `news_title` = NEW.`news_title`) THEN
   		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT ="Không thể thêm";
   END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `orderdetail`
--

DROP TABLE IF EXISTS `orderdetail`;
CREATE TABLE IF NOT EXISTS `orderdetail` (
  `orderID` char(15) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã đặt tiệc',
  `foodID` int NOT NULL COMMENT 'Mã thức ăn',
  `price` double NOT NULL COMMENT 'Giá tiền',
  `quantity` int NOT NULL,
  PRIMARY KEY (`orderID`,`foodID`),
  KEY `FK_ORDERPARTY_FOOD` (`foodID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderdetail`
--

INSERT INTO `orderdetail` (`orderID`, `foodID`, `price`, `quantity`) VALUES
('036912512529', 9, 300000, 10),
('036912512529', 10, 350000, 10),
('036912512529', 12, 100000, 10),
('036912512529', 24, 300000, 10),
('036912512529', 25, 300000, 10),
('036912712029', 1, 200000, 20),
('036912712029', 2, 300000, 20),
('036912712029', 3, 300000, 20),
('036912712029', 4, 300000, 20),
('036912712729', 1, 200000, 5),
('036912712729', 2, 300000, 5),
('036912712729', 4, 300000, 5),
('036912712729', 5, 400000, 5),
('036912712829', 1, 200000, 20),
('036912712829', 2, 300000, 20),
('036912712829', 6, 80000, 20),
('036912712829', 9, 300000, 20),
('036912712829', 10, 350000, 20),
('036912712829', 12, 100000, 20),
('036912712929', 9, 300000, 20),
('036912712929', 13, 200000, 20),
('036912712929', 25, 300000, 20),
('036912712929', 42, 80000, 20),
('036932532529', 1, 200000, 2),
('036932532529', 7, 200000, 2),
('036932532529', 8, 300000, 2),
('036932532529', 15, 350000, 2),
('036932532529', 17, 400000, 2),
('036932532529', 20, 350000, 2),
('036965532329', 2, 300000, 20),
('036965532329', 4, 300000, 20),
('036965532329', 5, 400000, 20),
('036965532329', 9, 300000, 20),
('036965532429', 6, 80000, 4),
('036965532429', 11, 400000, 4),
('036965532429', 12, 100000, 4),
('036965532429', 15, 350000, 4),
('036965532429', 19, 250000, 4),
('036965532429', 23, 400000, 4),
('036965532629', 1, 200000, 3),
('036965532629', 2, 300000, 3),
('036965532629', 6, 80000, 3),
('036965532629', 9, 300000, 3),
('036965532629', 10, 350000, 3),
('036965532629', 12, 100000, 3),
('036965532927', 5, 400000, 2),
('036965532927', 6, 80000, 2),
('036965532927', 9, 300000, 2),
('036965532927', 10, 350000, 2),
('036965532927', 25, 300000, 2),
('036965532927', 31, 300000, 2),
('036965532929', 9, 300000, 5),
('036965532929', 13, 200000, 5),
('036965532929', 25, 300000, 5),
('036965532929', 42, 80000, 5);

-- --------------------------------------------------------

--
-- Table structure for table `orderparty`
--

DROP TABLE IF EXISTS `orderparty`;
CREATE TABLE IF NOT EXISTS `orderparty` (
  `orderID` char(15) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã đặt tiệc',
  `serviceID` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã dịch vụ',
  `userName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên khách hàng',
  `userEmail` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Email của khách hàng',
  `phone` char(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số điện thoại của khách hàng',
  `attendeesCount` int NOT NULL,
  `tableCount` int NOT NULL,
  `orderDate` date NOT NULL COMMENT 'Ngày tạo đơn đặt tiệc',
  `orderTotal` double NOT NULL COMMENT 'Tổng tiền trên đơn đặt tiệc',
  `deposit` double DEFAULT NULL COMMENT 'Tiền đặt cọc',
  `isConfirm` tinyint(1) DEFAULT NULL COMMENT 'Trạng thái xác nhận',
  `roomID` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã phòng đặt tiệc',
  `adminID` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createAt` date DEFAULT NULL,
  `deleteRequest` tinyint NOT NULL,
  `isCompleted` tinyint NOT NULL,
  PRIMARY KEY (`orderID`),
  KEY `FK_ROOM_ORDERPARTY` (`roomID`),
  KEY `FK_SERVICES_ORDERPARTY` (`serviceID`),
  KEY `FK_ADMINUSER_ORDERPARTY` (`adminID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderparty`
--

INSERT INTO `orderparty` (`orderID`, `serviceID`, `userName`, `userEmail`, `phone`, `attendeesCount`, `tableCount`, `orderDate`, `orderTotal`, `deposit`, `isConfirm`, `roomID`, `adminID`, `createAt`, `deleteRequest`, `isCompleted`) VALUES
('036912512529', 'TDH', 'Lưu Quy Danh', 'hung.tran@gmail.com', '0369125121', 100, 10, '2023-12-22', 1850000, 1000000, 1, 'S01', 'DH52003194', NULL, 0, 0),
('036912712029', 'TDH', 'Ngô Thanh Sơn', 'abc@gmail.com', '0369127120', 200, 20, '2023-12-29', 22450000, 10000000, 1, 'S02', 'DH52003194', NULL, 0, 0),
('036912712729', 'TDH', 'Lưu Quốc Tuấn', 'abc@gmail.com', '0369127127', 46, 5, '2023-12-29', 6280000, 4000000, 1, '302', 'DH52003194', NULL, 0, 0),
('036912712829', 'TDH', 'Trần Tý', 'abc@gmail.com', '0369127128', 200, 20, '2023-12-29', 27300000, NULL, NULL, '402', NULL, NULL, 0, 0),
('036912712929', 'TDH', 'Trần Dương ', 'abc@gmail.com', '0369127129', 200, 20, '2023-12-29', 18100000, NULL, NULL, 'S01', NULL, NULL, 0, 0),
('036932532529', 'TC', 'Trần Dũng', '', '0369325325', 14, 2, '2023-12-29', 3830000, NULL, NULL, '202', NULL, NULL, 0, 0),
('036965532329', 'TDH', 'Ngô Thanh Thúy', 'abc@gmail.com', '0369655323', 200, 20, '2023-12-29', 26700000, NULL, NULL, '401', NULL, NULL, 0, 0),
('036965532429', 'TC', 'Ngô Tý', '', '0369655324', 34, 4, '2023-12-29', 6670000, NULL, NULL, '303', NULL, NULL, 0, 0),
('036965532629', 'TC', 'Ngô Thanh Duy', '', '0369655326', 30, 3, '2023-12-29', 4110000, NULL, NULL, 'BY02', NULL, NULL, 0, 0),
('036965532927', 'TKT', 'Ngô Hoài Thịnh', 'thinhngo@gmail.com', '0369655329', 15, 2, '2023-12-22', 8000000, 3740000, 1, '302', 'DH52003194', NULL, 0, 1),
('036965532929', 'TDH', 'Lưu Quy', '', '0369655329', 50, 5, '2023-12-29', 4700000, NULL, NULL, '301', NULL, NULL, 0, 0);

--
-- Triggers `orderparty`
--
DROP TRIGGER IF EXISTS `trigg_check_order`;
DELIMITER $$
CREATE TRIGGER `trigg_check_order` BEFORE INSERT ON `orderparty` FOR EACH ROW BEGIN
    DECLARE guest_exists INT;
    SELECT COUNT(*) INTO guest_exists
    FROM `orderparty`
    WHERE `orderparty`.`userName` = NEW.userName
    AND  `orderparty`.`orderDate` = NEW.orderDate;
    IF guest_exists > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Tên khách đã tồn tại trong ngày đặt tiệc.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `room_party`
--

DROP TABLE IF EXISTS `room_party`;
CREATE TABLE IF NOT EXISTS `room_party` (
  `roomID` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã phòng đặt tiệc',
  `roomName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên phòng đặt tiệc',
  `floor` int NOT NULL COMMENT 'Tầng lầu của phòng',
  `status` int DEFAULT NULL COMMENT 'Trạng thái của phòng',
  `minCapicity` int NOT NULL,
  `maxCapicity` int NOT NULL,
  `price` double NOT NULL,
  `image1` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image2` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image3` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`roomID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `room_party`
--

INSERT INTO `room_party` (`roomID`, `roomName`, `floor`, `status`, `minCapicity`, `maxCapicity`, `price`, `image1`, `image2`, `image3`) VALUES
('201', 'Phòng 201', 2, NULL, 10, 30, 250000, '201_1.jpg', '201_2.jpg', '201_3.jpg'),
('202', 'Phòng 202', 2, NULL, 5, 30, 230000, '202_1.jpg', '202_2.jpg', '202_3.jpg'),
('203', 'Phòng 203', 2, NULL, 5, 30, 200000, '203_1.jpg', '203_2.jpg', '203_3.jpg'),
('301', 'Phòng 301', 3, NULL, 15, 70, 300000, '301_1.jpg', '301_2.jpg', '301_3.jpg'),
('302', 'Phòng 302', 3, NULL, 15, 50, 280000, '302_1.jpg', '302_2.jpg', '302_3.jpg'),
('303', 'Phòng 303', 3, NULL, 15, 100, 350000, '303_1.jpg', '303_2.jpg', '303_3.jpg'),
('401', 'Phòng 401', 4, NULL, 200, 600, 700000, '401_1.jpg', '401_2.jpg', '401_3.jpg'),
('402', 'Phòng 402', 4, NULL, 200, 600, 700000, '402_1.jpg', '402_2.jpg', '402_3.jpg'),
('BY01', 'Sân sau 1', 0, NULL, 2, 20, 200000, 'BY01_1.jpg', 'BY01_2.jpg', 'BY01_3.jpg'),
('BY02', 'Sân sau 2', 0, NULL, 2, 10, 120000, 'BY02_1.jpg', 'BY02_2.jpg', 'BY02_3.jpg'),
('S01', 'Sảnh 1', 1, NULL, 30, 500, 500000, 'S01_1.jpg', 'S01_2.jpg', 'S01_3.jpg'),
('S02', 'Sân thượng', 5, NULL, 15, 200, 450000, 'S02_1.jpg', 'S02_2.jpg', 'S02_3.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `serviceID` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã dịch vụ',
  `serviceName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên dịch vụ tiệc',
  `destination` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`serviceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`serviceID`, `serviceName`, `destination`) VALUES
('TC', 'tiệc cưới', 'tiec-cuoi'),
('TDH', 'đám hỏi', 'dam-hoi'),
('TK', 'khác', 'khac'),
('TKT', 'khai trương', 'khai-truong'),
('TMT', 'mừng thọ', 'mung-tho'),
('TN', 'tân niên', 'tan-nien'),
('TSN', 'sinh nhật', 'sinh-nhat');

-- --------------------------------------------------------

--
-- Table structure for table `typeof_food`
--

DROP TABLE IF EXISTS `typeof_food`;
CREATE TABLE IF NOT EXISTS `typeof_food` (
  `typeID` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã loại thức ăn',
  `typeName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên loại thức ăn',
  PRIMARY KEY (`typeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `typeof_food`
--

INSERT INTO `typeof_food` (`typeID`, `typeName`) VALUES
('AC', 'Ăn chính'),
('KV', 'Khai vị'),
('TM', 'Tráng miệng');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bill`
--
ALTER TABLE `bill`
  ADD CONSTRAINT `FK_ADMINUSER_BILL` FOREIGN KEY (`adminID`) REFERENCES `admin_user` (`admin_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `FK_BILL_ORDERPARTY` FOREIGN KEY (`orderID`) REFERENCES `orderparty` (`orderID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `food`
--
ALTER TABLE `food`
  ADD CONSTRAINT `FK_TYPEFOOD_FOOD` FOREIGN KEY (`typeID`) REFERENCES `typeof_food` (`typeID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `FK_SERVICES_MENU` FOREIGN KEY (`serviceID`) REFERENCES `services` (`serviceID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `menudetail`
--
ALTER TABLE `menudetail`
  ADD CONSTRAINT `FK_FOOD_MENUDETAIL` FOREIGN KEY (`foodID`) REFERENCES `food` (`foodID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `FK_MENU_MENUDETAIL` FOREIGN KEY (`menuID`) REFERENCES `menu` (`menuID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `FK_ADMIN_NEWS` FOREIGN KEY (`admin_id`) REFERENCES `admin_user` (`admin_id`),
  ADD CONSTRAINT `FK_SERVICES_NEWS` FOREIGN KEY (`serviceID`) REFERENCES `services` (`serviceID`);

--
-- Constraints for table `orderdetail`
--
ALTER TABLE `orderdetail`
  ADD CONSTRAINT `FK_ORDERPARTY_FOOD` FOREIGN KEY (`foodID`) REFERENCES `food` (`foodID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `FK_ORDERPARTY_ORDERDETAIL` FOREIGN KEY (`orderID`) REFERENCES `orderparty` (`orderID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `orderparty`
--
ALTER TABLE `orderparty`
  ADD CONSTRAINT `FK_ADMINUSER_ORDERPARTY` FOREIGN KEY (`adminID`) REFERENCES `admin_user` (`admin_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `FK_ROOM_ORDERPARTY` FOREIGN KEY (`roomID`) REFERENCES `room_party` (`roomID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `FK_SERVICES_ORDERPARTY` FOREIGN KEY (`serviceID`) REFERENCES `services` (`serviceID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
