
CREATE DATABASE IF NOT EXISTS dbusers;

CREATE USER IF NOT EXISTS 'msauth'@'localhost' IDENTIFIED BY 'msauthsecret';
GRANT ALL PRIVILEGES ON dbusers.* TO 'msauth'@'localhost';
FLUSH PRIVILEGES;

-- USE dbusers;

-- CREATE TABLE IF NOT EXISTS Roles
-- (
--     id INT PRIMARY KEY NOT NULL,
--     name VARCHAR(100)
-- );

-- CREATE TABLE IF NOT EXISTS Users
-- (
--     id INT PRIMARY KEY NOT NULL,
--     name VARCHAR(50),
--     surname VARCHAR(50),
--     email VARCHAR(255),
--     password VARCHAR(50),
--     image VARCHAR(500),
--     roleid INT FOREIGN KEY REFERENCES Roles(id)
-- );

-- CREATE TABLE IF NOT EXISTS Referents
-- (
--     newUserId INT FOREIGN KEY REFERENCES Users(id),
--     referentUserId INT FOREIGN KEY REFERENCES Users(id)
-- );
