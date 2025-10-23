ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS aqe_database;
CREATE USER IF NOT EXISTS 'aqe_user'@'localhost' IDENTIFIED BY 'aqe_password';
GRANT ALL PRIVILEGES ON aqe_database.* TO 'aqe_user'@'localhost';
FLUSH PRIVILEGES;
