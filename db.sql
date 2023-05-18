# ************************************************************
# Sequel Ace SQL dump
# 版本號： 20029
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主機: localhost (MySQL 8.0.25)
# 數據庫: stylish_backend
# 生成時間: 2023-05-16 15:57:00 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# 轉儲表 files
# ------------------------------------------------------------

DROP TABLE IF EXISTS `files`;

CREATE TABLE files (
	`id` bigint unsigned not null auto_increment PRIMARY KEY,
	`url` varchar(255),
	`content` varchar(255)
); ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;

INSERT INTO `files` (`url`, `content`)
VALUES
	('fake_url_1', '把文件內容擷取後再存進來'),
	('fake_url_2', '把文件內容擷取後再存進來'),
	('fake_url_3', '把文件內容擷取後再存進來'),

/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  	`id` bigint unsigned not null auto_increment PRIMARY KEY,
	`u_name` varchar(30) not null DEFAULT '新成員',
	`email` varchar(50) not null,
	`password` varchar(30) not null,
	`role_id` bigint unsigned not null DEFAULT 3,
	`home_id` bigint unsigned not null DEFAULT 1,
	`group_id` bigint unsigned DEFAULT 1,
	`join_semester` char(3) DEFAULT '01冬',
	`gender` char(1) DEFAULT '男',
	`birthday` DATE DEFAULT '2000-01-01',
	`department` varchar(20) DEFAULT '台大山服系大一',
	`student_id` varchar(20) DEFAULT 'B00000000',
	`picture_url` varchar(100) DEFAULT 'https://ibb.co/q9gGhqN'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `color` DISABLE KEYS */;

INSERT INTO `users` (`u_name`, `email`, `password`, `role_id`, `group_id`, `home_id`, `join_semester`, `gender`, `birthday`, `student_id`, `department`, `picture_url`) VALUES 
('user01', 'test01@gamil.com', 'test', 1, 2, 4, '20冬', '男', '2000-01-20', '台大資工所碩一', 'R11932028', 'https://ibb.co/V3kyhnS'),
('user02', 'test02@gamil.com', 'test', 2, 2, 1, '21冬', '女', '2001-04-01', '台大財金系大四', 'B08703012', 'https://ibb.co/q9gGhqN'),
('user03', 'test03@gamil.com', 'test', 3, 1, 2, '22夏', '女', '2000-11-23', '台大醫學系大四', 'B08401133', 'https://ibb.co/q9gGhqN'),
('user04', 'test04@gamil.com', 'test', 3, 2, 3, '21冬', '男', '2002-03-22', '台大社會系大三', 'B09304057', 'https://ibb.co/q9gGhqN'),
('user05', 'test05@gamil.com', 'test', 3, 3, 5, '18夏', '男', '1998-02-26', '台大農經所畢', 'R09607083', 'https://ibb.co/q9gGhqN'),
('user06', 'test06@gamil.com', 'test', 3, 4, 6, '20冬', '男', '1999-12-09', '台大地質系大五', 'B07201061', 'https://ibb.co/q9gGhqN');

/*!40000 ALTER TABLE `color` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 roles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` bigint unsigned not null auto_increment PRIMARY KEY,
  `r_name` varchar(30) not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `hot` DISABLE KEYS */;

INSERT INTO `roles` (`r_name`)
VALUES
	('admin'), 
	('coordinator'),
	('member');

/*!40000 ALTER TABLE `hot` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 groups
# ------------------------------------------------------------

DROP TABLE IF EXISTS `groups`;

CREATE TABLE `groups` (
  `id` bigint unsigned not null auto_increment PRIMARY KEY,
  `g_name` varchar(10) not null
); ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `hot_product` DISABLE KEYS */;

CREATE TABLE `groups` (
  `id` bigint unsigned not null auto_increment PRIMARY KEY,
  `g_name` varchar(10) not null
);

/*!40000 ALTER TABLE `hot_product` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 homes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `homes`;

CREATE TABLE `homes` (
  `id` bigint unsigned not null auto_increment PRIMARY KEY,
  `h_name` char(2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `homes` WRITE;
/*!40000 ALTER TABLE `order_table` DISABLE KEYS */;

INSERT INTO `homes` (`h_name`)
VALUES
	('加拿'),
	('新武'),
	('霧鹿'),
	('利稻'),
	('電光');

/*!40000 ALTER TABLE `order_table` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 types
# ------------------------------------------------------------

DROP TABLE IF EXISTS `types`;

CREATE TABLE `types` (
 `id` bigint unsigned not null auto_increment PRIMARY KEY,
 `t_name` varchar(10) not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `types` (t_name) VALUES 
	('自然'),
	('社會'),
	('藝文'),
	('晨讀'),
	('英文'),
	('數學'),
	('國文'),
	('綜合'),
	('活動'),
	('文健站'),
	('線上課輔'),
	('其他');

# 轉儲表 user_curriculum
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_curriculum`;

CREATE TABLE `user_curriculum` (
  `uid` bigint unsigned not null,
  `cid` bigint unsigned not null,
   PRIMARY KEY (`uid`, `cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `user_curriculum` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;

INSERT INTO `user_curriculum` (`uid`, `cid`) VALUES 
(3, 1),
(2, 2),
(4, 2),
(5, 3),
(6, 4),
(4, 5),
(5, 5),
(5, 6),
(5, 7),
(6, 8),
(6, 9),
(4, 10);

/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
