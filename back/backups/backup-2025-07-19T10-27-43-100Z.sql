-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: Smart_Beekeeper
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `beekeeper`
--

DROP TABLE IF EXISTS `beekeeper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beekeeper` (
  `BeekeeperID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`BeekeeperID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beekeeper`
--

LOCK TABLES `beekeeper` WRITE;
/*!40000 ALTER TABLE `beekeeper` DISABLE KEYS */;
INSERT INTO `beekeeper` VALUES (1,'Sok Dara','012345678','dara@example.com'),(2,'Chantha Rith','093456789','rith@example.com'),(3,'Malis Srey','087654321','malis@example.com'),(4,'Sothea Kim','099112233','sothea@example.com');
/*!40000 ALTER TABLE `beekeeper` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beespecies`
--

DROP TABLE IF EXISTS `beespecies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beespecies` (
  `SpeciesID` int NOT NULL AUTO_INCREMENT,
  `CommonName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ScientificName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`SpeciesID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beespecies`
--

LOCK TABLES `beespecies` WRITE;
/*!40000 ALTER TABLE `beespecies` DISABLE KEYS */;
INSERT INTO `beespecies` VALUES (1,'Asian Honey Bee','Apis cerana'),(2,'European Honey Bee','Apis mellifera'),(3,'Giant Honey Bee','Apis dorsata');
/*!40000 ALTER TABLE `beespecies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `environmentdata`
--

DROP TABLE IF EXISTS `environmentdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `environmentdata` (
  `DataID` int NOT NULL AUTO_INCREMENT,
  `HiveID` int DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Temperature` float DEFAULT NULL,
  `Humidity` float DEFAULT NULL,
  PRIMARY KEY (`DataID`),
  KEY `HiveID` (`HiveID`),
  CONSTRAINT `environmentdata_ibfk_1` FOREIGN KEY (`HiveID`) REFERENCES `hive` (`HiveID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `environmentdata`
--

LOCK TABLES `environmentdata` WRITE;
/*!40000 ALTER TABLE `environmentdata` DISABLE KEYS */;
INSERT INTO `environmentdata` VALUES (1,1,'2024-07-01',33.1,58),(2,2,'2024-07-01',32.9,59.2),(3,3,'2024-07-01',34.3,60.1),(4,4,'2024-07-01',31.8,57.5),(5,5,'2024-07-01',30.9,55),(6,6,'2024-07-01',35,60.3),(7,7,'2024-07-01',32.2,61.5),(8,8,'2024-07-01',33.8,59),(9,9,'2024-07-01',34.5,62.1),(10,10,'2024-07-01',31,56.4),(11,11,'2024-07-01',33.7,58.6),(12,12,'2024-07-01',34,57),(13,13,'2024-07-01',32.4,60.8),(14,14,'2024-07-01',33.9,59.7),(15,15,'2024-07-01',31.3,56.2),(16,16,'2024-07-01',32.5,58.9),(17,17,'2024-07-01',33.6,60.5),(18,18,'2024-07-01',34.2,61),(19,19,'2024-07-01',30.8,57.1),(20,20,'2024-07-01',35.1,62.7);
/*!40000 ALTER TABLE `environmentdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hive`
--

DROP TABLE IF EXISTS `hive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hive` (
  `HiveID` int NOT NULL AUTO_INCREMENT,
  `Location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `InstallDate` date DEFAULT NULL,
  `Status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BeekeeperID` int DEFAULT NULL,
  `SpeciesID` int DEFAULT NULL,
  PRIMARY KEY (`HiveID`),
  KEY `BeekeeperID` (`BeekeeperID`),
  KEY `SpeciesID` (`SpeciesID`),
  CONSTRAINT `hive_ibfk_1` FOREIGN KEY (`BeekeeperID`) REFERENCES `beekeeper` (`BeekeeperID`) ON DELETE SET NULL,
  CONSTRAINT `hive_ibfk_2` FOREIGN KEY (`SpeciesID`) REFERENCES `beespecies` (`SpeciesID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hive`
--

LOCK TABLES `hive` WRITE;
/*!40000 ALTER TABLE `hive` DISABLE KEYS */;
INSERT INTO `hive` VALUES (1,'Location 1','2024-01-10','Active',1,1),(2,'Location 2','2024-01-12','Inactive',2,2),(3,'Location 3','2024-01-15','Active',3,3),(4,'Location 4','2024-02-01','Active',4,1),(5,'Location 5','2024-02-10','Inactive',NULL,2),(6,'Location 6','2024-02-18','Active',1,3),(7,'Location 7','2024-03-01','Active',2,1),(8,'Location 8','2024-03-10','Active',3,2),(9,'Location 9','2024-03-15','Inactive',4,3),(10,'Location 10','2024-03-20','Active',NULL,1),(11,'Location 11','2024-04-01','Active',1,2),(12,'Location 12','2024-04-05','Active',2,3),(13,'Location 13','2024-04-10','Inactive',3,1),(14,'Location 14','2024-04-15','Active',4,2),(15,'Location 15','2024-05-01','Active',NULL,3),(16,'Location 16','2024-05-10','Active',1,1),(17,'Location 17','2024-05-15','Inactive',2,2),(18,'Location 18','2024-06-01','Active',3,3),(19,'Location 19','2024-06-05','Active',4,1),(20,'Location 20','2024-06-10','Inactive',NULL,2);
/*!40000 ALTER TABLE `hive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `honeyproduction`
--

DROP TABLE IF EXISTS `honeyproduction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `honeyproduction` (
  `RecordID` int NOT NULL AUTO_INCREMENT,
  `HiveID` int DEFAULT NULL,
  `HarvestDate` date DEFAULT NULL,
  `WeightKG` float DEFAULT NULL,
  PRIMARY KEY (`RecordID`),
  KEY `HiveID` (`HiveID`),
  CONSTRAINT `honeyproduction_ibfk_1` FOREIGN KEY (`HiveID`) REFERENCES `hive` (`HiveID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `honeyproduction`
--

LOCK TABLES `honeyproduction` WRITE;
/*!40000 ALTER TABLE `honeyproduction` DISABLE KEYS */;
INSERT INTO `honeyproduction` VALUES (1,1,'2024-07-02',10.25),(2,2,'2024-07-02',11),(3,3,'2024-07-02',12.5),(4,4,'2024-07-02',9.75),(5,5,'2024-07-02',10),(6,6,'2024-07-02',13.25),(7,7,'2024-07-02',8.9),(8,8,'2024-07-02',9.2),(9,9,'2024-07-02',11.6),(10,10,'2024-07-02',10.4),(11,11,'2024-07-02',9.85),(12,12,'2024-07-02',10.9),(13,13,'2024-07-02',12),(14,14,'2024-07-02',8.75),(15,15,'2024-07-02',9.55),(16,16,'2024-07-02',11.2),(17,17,'2024-07-02',13),(18,18,'2024-07-02',12.75),(19,19,'2024-07-02',9.95),(20,20,'2024-07-02',10.6);
/*!40000 ALTER TABLE `honeyproduction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenancelog`
--

DROP TABLE IF EXISTS `maintenancelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenancelog` (
  `LogID` int NOT NULL AUTO_INCREMENT,
  `HiveID` int DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `BeekeeperID` int DEFAULT NULL,
  PRIMARY KEY (`LogID`),
  KEY `HiveID` (`HiveID`),
  KEY `BeekeeperID` (`BeekeeperID`),
  CONSTRAINT `maintenancelog_ibfk_1` FOREIGN KEY (`HiveID`) REFERENCES `hive` (`HiveID`) ON DELETE CASCADE,
  CONSTRAINT `maintenancelog_ibfk_2` FOREIGN KEY (`BeekeeperID`) REFERENCES `beekeeper` (`BeekeeperID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenancelog`
--

LOCK TABLES `maintenancelog` WRITE;
/*!40000 ALTER TABLE `maintenancelog` DISABLE KEYS */;
INSERT INTO `maintenancelog` VALUES (1,1,'2024-07-03','Checked queen cell',1),(2,2,'2024-07-03','Cleaned frames',2),(3,3,'2024-07-03','Treated mites',3),(4,4,'2024-07-03','Fed bees sugar syrup',4),(5,5,'2024-07-03','Ventilation improved',NULL),(6,6,'2024-07-03','Inspected larvae',1),(7,7,'2024-07-03','Repaired frame',2),(8,8,'2024-07-03','Swarm prevention',3),(9,9,'2024-07-03','Removed pests',4),(10,10,'2024-07-03','Marked queen',NULL),(11,11,'2024-07-03','Observed behavior',1),(12,12,'2024-07-03','Added supers',2),(13,13,'2024-07-03','Cleaned hive floor',3),(14,14,'2024-07-03','Rotated boxes',4),(15,15,'2024-07-03','Inspected eggs',NULL),(16,16,'2024-07-03','Frame replacement',1),(17,17,'2024-07-03','Pollen supply check',2),(18,18,'2024-07-03','Bees health OK',3),(19,19,'2024-07-03','Feeding resumed',4),(20,20,'2024-07-03','New queen tested',NULL);
/*!40000 ALTER TABLE `maintenancelog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantnearby`
--

DROP TABLE IF EXISTS `plantnearby`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantnearby` (
  `PlantID` int NOT NULL AUTO_INCREMENT,
  `HiveID` int DEFAULT NULL,
  `PlantName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DistanceM` float DEFAULT NULL,
  PRIMARY KEY (`PlantID`),
  KEY `HiveID` (`HiveID`),
  CONSTRAINT `plantnearby_ibfk_1` FOREIGN KEY (`HiveID`) REFERENCES `hive` (`HiveID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantnearby`
--

LOCK TABLES `plantnearby` WRITE;
/*!40000 ALTER TABLE `plantnearby` DISABLE KEYS */;
INSERT INTO `plantnearby` VALUES (1,1,'Sunflower',12.5),(2,1,'Mango',25),(3,2,'Lychee',15),(4,3,'Wildflower',10.5),(5,4,'Clover',18),(6,5,'Palm',20),(7,6,'Avocado',16.2),(8,7,'Banana',14),(9,8,'Longan',21.1),(10,9,'Orange',17.6),(11,10,'Lime',19.3),(12,11,'Papaya',11.4),(13,12,'Jackfruit',23),(14,13,'Peach',13.3),(15,14,'Tamarind',24.6),(16,15,'Cashew',22),(17,16,'Cornflower',18.7),(18,17,'Lavender',15.5),(19,18,'Rosemary',17.8),(20,19,'Sage',12.2),(21,20,'Basil',14.9);
/*!40000 ALTER TABLE `plantnearby` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `queenbee`
--

DROP TABLE IF EXISTS `queenbee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `queenbee` (
  `QueenID` int NOT NULL AUTO_INCREMENT,
  `HiveID` int DEFAULT NULL,
  `BirthDate` date DEFAULT NULL,
  `SpeciesID` int DEFAULT NULL,
  PRIMARY KEY (`QueenID`),
  UNIQUE KEY `HiveID` (`HiveID`),
  KEY `SpeciesID` (`SpeciesID`),
  CONSTRAINT `queenbee_ibfk_1` FOREIGN KEY (`HiveID`) REFERENCES `hive` (`HiveID`) ON DELETE CASCADE,
  CONSTRAINT `queenbee_ibfk_2` FOREIGN KEY (`SpeciesID`) REFERENCES `beespecies` (`SpeciesID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `queenbee`
--

LOCK TABLES `queenbee` WRITE;
/*!40000 ALTER TABLE `queenbee` DISABLE KEYS */;
INSERT INTO `queenbee` VALUES (1,1,'2023-12-10',1),(2,2,'2023-12-12',2),(3,3,'2023-12-15',3),(4,4,'2024-01-01',1),(5,5,'2024-01-05',2),(6,6,'2024-01-10',3),(7,7,'2024-01-15',1),(8,8,'2024-01-20',2),(9,9,'2024-01-25',3),(10,10,'2024-02-01',1),(11,11,'2024-02-05',2),(12,12,'2024-02-10',3),(13,13,'2024-02-15',1),(14,14,'2024-02-20',2),(15,15,'2024-03-01',3),(16,16,'2024-03-05',1),(17,17,'2024-03-10',2),(18,18,'2024-03-15',3),(19,19,'2024-03-20',1),(20,20,'2024-03-25',2);
/*!40000 ALTER TABLE `queenbee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userpermissions`
--

DROP TABLE IF EXISTS `userpermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userpermissions` (
  `UserPermissionID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `Permission` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `GrantedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserPermissionID`),
  UNIQUE KEY `unique_user_permission` (`UserID`,`Permission`),
  KEY `idx_user_id` (`UserID`),
  KEY `idx_permission` (`Permission`),
  KEY `idx_granted_at` (`GrantedAt`),
  CONSTRAINT `userpermissions_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userpermissions`
--

LOCK TABLES `userpermissions` WRITE;
/*!40000 ALTER TABLE `userpermissions` DISABLE KEYS */;
INSERT INTO `userpermissions` VALUES (1,1,'user:create','2025-07-18 01:50:50'),(2,1,'user:read','2025-07-18 01:50:50'),(3,1,'user:update','2025-07-18 01:50:50'),(4,1,'user:delete','2025-07-18 01:50:50'),(5,1,'beekeeper:create','2025-07-18 01:50:50'),(6,1,'beekeeper:read','2025-07-18 01:50:50'),(7,1,'beekeeper:update','2025-07-18 01:50:50'),(8,1,'beekeeper:delete','2025-07-18 01:50:50'),(9,1,'hive:create','2025-07-18 01:50:50'),(10,1,'hive:read','2025-07-18 01:50:50'),(11,1,'hive:update','2025-07-18 01:50:50'),(12,1,'hive:delete','2025-07-18 01:50:50'),(13,1,'species:create','2025-07-18 01:50:50'),(14,1,'species:read','2025-07-18 01:50:50'),(15,1,'species:update','2025-07-18 01:50:50'),(16,1,'species:delete','2025-07-18 01:50:50'),(17,1,'environment:create','2025-07-18 01:50:50'),(18,1,'environment:read','2025-07-18 01:50:50'),(19,1,'environment:update','2025-07-18 01:50:50'),(20,1,'environment:delete','2025-07-18 01:50:50'),(21,1,'plant:create','2025-07-18 01:50:50'),(22,1,'plant:read','2025-07-18 01:50:50'),(23,1,'plant:update','2025-07-18 01:50:50'),(24,1,'plant:delete','2025-07-18 01:50:50'),(25,1,'honey:create','2025-07-18 01:50:50'),(26,1,'honey:read','2025-07-18 01:50:50'),(27,1,'honey:update','2025-07-18 01:50:50'),(28,1,'honey:delete','2025-07-18 01:50:50');
/*!40000 ALTER TABLE `userpermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `PasswordHash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Role` enum('admin','manager','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `IsActive` tinyint(1) DEFAULT '1',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `LastLogin` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`),
  KEY `idx_username` (`Username`),
  KEY `idx_email` (`Email`),
  KEY `idx_role` (`Role`),
  KEY `idx_is_active` (`IsActive`),
  KEY `idx_created_at` (`CreatedAt`),
  KEY `idx_last_login` (`LastLogin`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@beekeeper.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O','admin',1,'2025-07-18 01:50:50',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `userswithpermissions`
--

DROP TABLE IF EXISTS `userswithpermissions`;
/*!50001 DROP VIEW IF EXISTS `userswithpermissions`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `userswithpermissions` AS SELECT 
 1 AS `UserID`,
 1 AS `Username`,
 1 AS `Email`,
 1 AS `Role`,
 1 AS `IsActive`,
 1 AS `CreatedAt`,
 1 AS `LastLogin`,
 1 AS `Permissions`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `userswithpermissions`
--

/*!50001 DROP VIEW IF EXISTS `userswithpermissions`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `userswithpermissions` AS select `u`.`UserID` AS `UserID`,`u`.`Username` AS `Username`,`u`.`Email` AS `Email`,`u`.`Role` AS `Role`,`u`.`IsActive` AS `IsActive`,`u`.`CreatedAt` AS `CreatedAt`,`u`.`LastLogin` AS `LastLogin`,group_concat(`up`.`Permission` order by `up`.`Permission` ASC separator ',') AS `Permissions` from (`users` `u` left join `userpermissions` `up` on((`u`.`UserID` = `up`.`UserID`))) group by `u`.`UserID`,`u`.`Username`,`u`.`Email`,`u`.`Role`,`u`.`IsActive`,`u`.`CreatedAt`,`u`.`LastLogin` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-19 17:27:43
