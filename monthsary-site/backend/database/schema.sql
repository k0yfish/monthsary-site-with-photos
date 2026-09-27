-- Run this once to set up the database:
--   mysql -u root -p < backend/database/schema.sql

CREATE DATABASE IF NOT EXISTS monthsary_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE defaultdb;

CREATE TABLE IF NOT EXISTS notes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(40)  NULL,
  message    VARCHAR(500) NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
