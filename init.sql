CREATE DATABASE IF NOT EXISTS dbusers;
CREATE USER IF NOT EXISTS 'msauth'@'localhost' IDENTIFIED BY 'msauthsecret';
GRANT ALL PRIVILEGES ON dbusers.* TO 'msauth'@'localhost';
FLUSH PRIVILEGES;