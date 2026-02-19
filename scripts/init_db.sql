
-- Initialize QBook Database
CREATE DATABASE IF NOT EXISTS qbook_db;
USE qbook_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Simulation Extensions (Safe to run if columns exist, but standard SQL doesn't support IF NOT EXISTS for columns easily.
-- This block is for initial setup. If table exists, these might fail if running strictly, but for fresh setup it's fine.)

-- You can run these manually if the table exists but columns don't:
-- ALTER TABLE users ADD COLUMN display_name VARCHAR(255);
-- ALTER TABLE users ADD COLUMN avatar VARCHAR(255);
-- ALTER TABLE users ADD COLUMN bio TEXT;
-- ALTER TABLE users ADD COLUMN gender VARCHAR(20) DEFAULT 'unknown';
-- ALTER TABLE users ADD COLUMN is_bot BOOLEAN DEFAULT FALSE;
-- ALTER TABLE users ADD COLUMN simulation_id VARCHAR(50) UNIQUE;

-- Posts Table (If not already present)
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Likes/Interactions
CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
