-- 1. Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS Smart_Beekeeper DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Smart_Beekeeper;

-- 2. Create application MySQL user and grant privileges
CREATE USER IF NOT EXISTS 'db_admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mydb1';
ALTER USER 'db_admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mydb1';
GRANT ALL PRIVILEGES ON Smart_Beekeeper.* TO 'db_admin'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- 3. Drop views and tables if they exist (for clean setup)
DROP VIEW IF EXISTS UsersWithPermissions;
DROP TABLE IF EXISTS UserPermissions;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS MaintenanceLog;
DROP TABLE IF EXISTS PlantNearby;
DROP TABLE IF EXISTS HoneyProduction;
DROP TABLE IF EXISTS EnvironmentData;
DROP TABLE IF EXISTS QueenBee;
DROP TABLE IF EXISTS Hive;
DROP TABLE IF EXISTS BeeSpecies;
DROP TABLE IF EXISTS Beekeeper;

-- 4. Create main tables

CREATE TABLE Beekeeper (
    BeekeeperID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Phone VARCHAR(20),
    Email VARCHAR(100)
);

CREATE TABLE BeeSpecies (
    SpeciesID INT AUTO_INCREMENT PRIMARY KEY,
    CommonName VARCHAR(50),
    ScientificName VARCHAR(100)
);

CREATE TABLE Hive (
    HiveID INT AUTO_INCREMENT PRIMARY KEY,
    Location VARCHAR(100),
    InstallDate DATE,
    Status VARCHAR(20),
    BeekeeperID INT,
    SpeciesID INT,
    FOREIGN KEY (BeekeeperID) REFERENCES Beekeeper(BeekeeperID) ON DELETE SET NULL,
    FOREIGN KEY (SpeciesID) REFERENCES BeeSpecies(SpeciesID) ON DELETE SET NULL
);

CREATE TABLE QueenBee (
    QueenID INT AUTO_INCREMENT PRIMARY KEY,
    HiveID INT UNIQUE,
    BirthDate DATE,
    SpeciesID INT,
    FOREIGN KEY (HiveID) REFERENCES Hive(HiveID) ON DELETE CASCADE,
    FOREIGN KEY (SpeciesID) REFERENCES BeeSpecies(SpeciesID) ON DELETE SET NULL
);

CREATE TABLE EnvironmentData (
    DataID INT AUTO_INCREMENT PRIMARY KEY,
    HiveID INT,
    Date DATE,
    Temperature FLOAT,
    Humidity FLOAT,
    FOREIGN KEY (HiveID) REFERENCES Hive(HiveID) ON DELETE CASCADE
);

CREATE TABLE HoneyProduction (
    RecordID INT AUTO_INCREMENT PRIMARY KEY,
    HiveID INT,
    HarvestDate DATE,
    WeightKG FLOAT,
    FOREIGN KEY (HiveID) REFERENCES Hive(HiveID) ON DELETE CASCADE
);

CREATE TABLE PlantNearby (
    PlantID INT AUTO_INCREMENT PRIMARY KEY,
    HiveID INT,
    PlantName VARCHAR(100),
    DistanceM FLOAT,
    FOREIGN KEY (HiveID) REFERENCES Hive(HiveID) ON DELETE CASCADE
);

CREATE TABLE MaintenanceLog (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    HiveID INT,
    Date DATE,
    Note TEXT,
    BeekeeperID INT,
    FOREIGN KEY (HiveID) REFERENCES Hive(HiveID) ON DELETE CASCADE,
    FOREIGN KEY (BeekeeperID) REFERENCES Beekeeper(BeekeeperID) ON DELETE SET NULL
);

-- 5. User Management System Tables

CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('admin', 'manager', 'user') DEFAULT 'user',
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastLogin TIMESTAMP NULL,
    INDEX idx_username (Username),
    INDEX idx_email (Email),
    INDEX idx_role (Role),
    INDEX idx_is_active (IsActive),
    INDEX idx_created_at (CreatedAt),
    INDEX idx_last_login (LastLogin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE backup_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    size_mb DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE TABLE UserPermissions (
    UserPermissionID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Permission VARCHAR(100) NOT NULL,
    GrantedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    UNIQUE KEY unique_user_permission (UserID, Permission),
    INDEX idx_user_id (UserID),
    INDEX idx_permission (Permission),
    INDEX idx_granted_at (GrantedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Insert default admin user (password: admin123)
-- This password hash corresponds to 'admin123' with bcrypt salt rounds 12
INSERT INTO Users (Username, Email, PasswordHash, Role, IsActive) VALUES 
('admin', 'admin@beekeeper.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', 'admin', TRUE);

SET @admin_user_id = LAST_INSERT_ID();

-- Insert all permissions for admin user
INSERT INTO UserPermissions (UserID, Permission) VALUES
(@admin_user_id, 'user:create'),
(@admin_user_id, 'user:read'),
(@admin_user_id, 'user:update'),
(@admin_user_id, 'user:delete'),
(@admin_user_id, 'beekeeper:create'),
(@admin_user_id, 'beekeeper:read'),
(@admin_user_id, 'beekeeper:update'),
(@admin_user_id, 'beekeeper:delete'),
(@admin_user_id, 'hive:create'),
(@admin_user_id, 'hive:read'),
(@admin_user_id, 'hive:update'),
(@admin_user_id, 'hive:delete'),
(@admin_user_id, 'species:create'),
(@admin_user_id, 'species:read'),
(@admin_user_id, 'species:update'),
(@admin_user_id, 'species:delete'),
(@admin_user_id, 'environment:create'),
(@admin_user_id, 'environment:read'),
(@admin_user_id, 'environment:update'),
(@admin_user_id, 'environment:delete'),
(@admin_user_id, 'plant:create'),
(@admin_user_id, 'plant:read'),
(@admin_user_id, 'plant:update'),
(@admin_user_id, 'plant:delete'),
(@admin_user_id, 'honey:create'),
(@admin_user_id, 'honey:read'),
(@admin_user_id, 'honey:update'),
(@admin_user_id, 'honey:delete');

-- 7. Create a view for users with their permissions
CREATE VIEW UsersWithPermissions AS
SELECT 
    u.UserID,
    u.Username,
    u.Email,
    u.Role,
    u.IsActive,
    u.CreatedAt,
    u.LastLogin,
    GROUP_CONCAT(up.Permission ORDER BY up.Permission SEPARATOR ',') as Permissions
FROM Users u
LEFT JOIN UserPermissions up ON u.UserID = up.UserID
GROUP BY u.UserID, u.Username, u.Email, u.Role, u.IsActive, u.CreatedAt, u.LastLogin;

-- 8. (Optional) Insert sample data for other tables here...

-- 9. Show setup completion
SELECT 'Database Setup Complete!' as Status;
SHOW TABLES;
SELECT * FROM Users WHERE Role = 'admin';

-- Insert data
INSERT INTO Beekeeper (Name, Phone, Email) VALUES
('Sok Dara', '012345678', 'dara@example.com'),
('Chantha Rith', '093456789', 'rith@example.com'),
('Malis Srey', '087654321', 'malis@example.com'),
('Sothea Kim', '099112233', 'sothea@example.com'),
('Piseth Nara', '088998877', 'piseth@example.com');


INSERT INTO BeeSpecies (CommonName, ScientificName) VALUES
('Asian Honey Bee', 'Apis cerana'),
('European Honey Bee', 'Apis mellifera'),
('Giant Honey Bee', 'Apis dorsata');


INSERT INTO Hive (Location, InstallDate, Status, BeekeeperID, SpeciesID) VALUES
('Location 1', '2024-01-10', 'Active', 1, 1),
('Location 2', '2024-01-12', 'Inactive', 2, 2),
('Location 3', '2024-01-15', 'Active', 3, 3),
('Location 4', '2024-02-01', 'Active', 4, 1),
('Location 5', '2024-02-10', 'Inactive', 5, 2),
('Location 6', '2024-02-18', 'Active', 1, 3),
('Location 7', '2024-03-01', 'Active', 2, 1),
('Location 8', '2024-03-10', 'Active', 3, 2),
('Location 9', '2024-03-15', 'Inactive', 4, 3),
('Location 10', '2024-03-20', 'Active', 5, 1),
('Location 11', '2024-04-01', 'Active', 1, 2),
('Location 12', '2024-04-05', 'Active', 2, 3),
('Location 13', '2024-04-10', 'Inactive', 3, 1),
('Location 14', '2024-04-15', 'Active', 4, 2),
('Location 15', '2024-05-01', 'Active', 5, 3),
('Location 16', '2024-05-10', 'Active', 1, 1),
('Location 17', '2024-05-15', 'Inactive', 2, 2),
('Location 18', '2024-06-01', 'Active', 3, 3),
('Location 19', '2024-06-05', 'Active', 4, 1),
('Location 20', '2024-06-10', 'Inactive', 5, 2);

INSERT INTO QueenBee (HiveID, BirthDate, SpeciesID) VALUES
(1, '2023-12-10', 1), (2, '2023-12-12', 2), (3, '2023-12-15', 3),
(4, '2024-01-01', 1), (5, '2024-01-05', 2), (6, '2024-01-10', 3),
(7, '2024-01-15', 1), (8, '2024-01-20', 2), (9, '2024-01-25', 3),
(10, '2024-02-01', 1), (11, '2024-02-05', 2), (12, '2024-02-10', 3),
(13, '2024-02-15', 1), (14, '2024-02-20', 2), (15, '2024-03-01', 3),
(16, '2024-03-05', 1), (17, '2024-03-10', 2), (18, '2024-03-15', 3),
(19, '2024-03-20', 1), (20, '2024-03-25', 2);


INSERT INTO EnvironmentData (HiveID, Date, Temperature, Humidity) VALUES
(1, '2024-07-01', 33.1, 58.0), (2, '2024-07-01', 32.9, 59.2),
(3, '2024-07-01', 34.3, 60.1), (4, '2024-07-01', 31.8, 57.5),
(5, '2024-07-01', 30.9, 55.0), (6, '2024-07-01', 35.0, 60.3),
(7, '2024-07-01', 32.2, 61.5), (8, '2024-07-01', 33.8, 59.0),
(9, '2024-07-01', 34.5, 62.1), (10, '2024-07-01', 31.0, 56.4),
(11, '2024-07-01', 33.7, 58.6), (12, '2024-07-01', 34.0, 57.0),
(13, '2024-07-01', 32.4, 60.8), (14, '2024-07-01', 33.9, 59.7),
(15, '2024-07-01', 31.3, 56.2), (16, '2024-07-01', 32.5, 58.9),
(17, '2024-07-01', 33.6, 60.5), (18, '2024-07-01', 34.2, 61.0),
(19, '2024-07-01', 30.8, 57.1), (20, '2024-07-01', 35.1, 62.7);


INSERT INTO HoneyProduction (HiveID, HarvestDate, WeightKG) VALUES
(1, '2024-07-02', 10.25), (2, '2024-07-02', 11.00),
(3, '2024-07-02', 12.50), (4, '2024-07-02', 9.75),
(5, '2024-07-02', 10.00), (6, '2024-07-02', 13.25),
(7, '2024-07-02', 8.90), (8, '2024-07-02', 9.20),
(9, '2024-07-02', 11.60), (10, '2024-07-02', 10.40),
(11, '2024-07-02', 9.85), (12, '2024-07-02', 10.90),
(13, '2024-07-02', 12.00), (14, '2024-07-02', 8.75),
(15, '2024-07-02', 9.55), (16, '2024-07-02', 11.20),
(17, '2024-07-02', 13.00), (18, '2024-07-02', 12.75),
(19, '2024-07-02', 9.95), (20, '2024-07-02', 10.60);


INSERT INTO PlantNearby (HiveID, PlantName, DistanceM) VALUES
(1, 'Sunflower', 12.5), (1, 'Mango', 25.0),
(2, 'Lychee', 15.0), (3, 'Wildflower', 10.5),
(4, 'Clover', 18.0), (5, 'Palm', 20.0),
(6, 'Avocado', 16.2), (7, 'Banana', 14.0),
(8, 'Longan', 21.1), (9, 'Orange', 17.6),
(10, 'Lime', 19.3), (11, 'Papaya', 11.4),
(12, 'Jackfruit', 23.0), (13, 'Peach', 13.3),
(14, 'Tamarind', 24.6), (15, 'Cashew', 22.0),
(16, 'Cornflower', 18.7), (17, 'Lavender', 15.5),
(18, 'Rosemary', 17.8), (19, 'Sage', 12.2),
(20, 'Basil', 14.9);
INSERT INTO MaintenanceLog (HiveID, Date, Note, BeekeeperID) VALUES
(1, '2024-07-03', 'Checked queen cell', 1),
(2, '2024-07-03', 'Cleaned frames', 2),
(3, '2024-07-03', 'Treated mites', 3),
(4, '2024-07-03', 'Fed bees sugar syrup', 4),
(5, '2024-07-03', 'Ventilation improved', 5),
(6, '2024-07-03', 'Inspected larvae', 1),
(7, '2024-07-03', 'Repaired frame', 2),
(8, '2024-07-03', 'Swarm prevention', 3),
(9, '2024-07-03', 'Removed pests', 4),
(10, '2024-07-03', 'Marked queen', 5),
(11, '2024-07-03', 'Observed behavior', 1),
(12, '2024-07-03', 'Added supers', 2),
(13, '2024-07-03', 'Cleaned hive floor', 3),
(14, '2024-07-03', 'Rotated boxes', 4),
(15, '2024-07-03', 'Inspected eggs', 5),
(16, '2024-07-03', 'Frame replacement', 1),
(17, '2024-07-03', 'Pollen supply check', 2),
(18, '2024-07-03', 'Bees health OK', 3),
(19, '2024-07-03', 'Feeding resumed', 4),
(20, '2024-07-03', 'New queen tested', 5);
-- ======================= USERS =====================

-- 1. Create database first (if not already created)
CREATE DATABASE IF NOT EXISTS Smart_Beekeeper;
USE Smart_Beekeeper;

-- 2. Create db_admin user
-- This user has full administrative privileges on the database
CREATE USER 'db_admin'@'localhost' IDENTIFIED BY 'mydb1';
GRANT ALL PRIVILEGES ON Smart_Beekeeper.* TO 'db_admin'@'localhost' WITH GRANT OPTION;

-- 3. Create beekeeper_manager user
CREATE USER 'beekeeper_manager'@'localhost' IDENTIFIED BY 'manager@123';

-- Grant necessary permissions to beekeeper_manager
GRANT SELECT, INSERT, UPDATE, DELETE ON Smart_Beekeeper.Beekeeper TO 'beekeeper_manager'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Smart_Beekeeper.Hive TO 'beekeeper_manager'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Smart_Beekeeper.QueenBee TO 'beekeeper_manager'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Smart_Beekeeper.EnvironmentData TO 'beekeeper_manager'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Smart_Beekeeper.HoneyProduction TO 'beekeeper_manager'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Smart_Beekeeper.PlantNearby TO 'beekeeper_manager'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Smart_Beekeeper.MaintenanceLog TO 'beekeeper_manager'@'localhost';

-- Read-only access to BeeSpecies
GRANT SELECT ON Smart_Beekeeper.BeeSpecies TO 'beekeeper_manager'@'localhost';

-- 4. Create data_entry_beekeeper user
CREATE USER 'data_entry_beekeeper'@'localhost' IDENTIFIED BY 'data_entry@123';

-- Grant INSERT/UPDATE/SELECT privileges
GRANT SELECT, INSERT, UPDATE ON Smart_Beekeeper.EnvironmentData TO 'data_entry_beekeeper'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Smart_Beekeeper.HoneyProduction TO 'data_entry_beekeeper'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Smart_Beekeeper.MaintenanceLog TO 'data_entry_beekeeper'@'localhost';


-- Reference read permissions
GRANT SELECT ON Smart_Beekeeper.Hive TO 'data_entry_beekeeper'@'localhost';
GRANT SELECT ON Smart_Beekeeper.QueenBee TO 'data_entry_beekeeper'@'localhost';
GRANT SELECT ON Smart_Beekeeper.BeeSpecies TO 'data_entry_beekeeper'@'localhost';
GRANT SELECT ON Smart_Beekeeper.Beekeeper TO 'data_entry_beekeeper'@'localhost';

-- 5. Create read_only_analyst user
CREATE USER 'read_only_analyst'@'localhost' IDENTIFIED BY 'analyst@123';

-- Read-only access to all tables in the database
GRANT SELECT ON Smart_Beekeeper.* TO 'read_only_analyst'@'localhost';

-- 6. Apply changes
FLUSH PRIVILEGES;
SET GLOBAL local_infile = 1;

select*from beekeeper;

DELETE FROM Users WHERE Username = 'admin';

INSERT INTO Users (Username, Email, PasswordHash, Role, IsActive) VALUES 
('admin', 'admin@beekeeper.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', 'admin', TRUE);
