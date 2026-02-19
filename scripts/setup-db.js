const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function setup() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'qbook_db';

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database ${dbName} created or exists.`);

        await connection.changeUser({ database: dbName });

        const userTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'citizen',
        avatar_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        await connection.query(userTable);
        console.log('Users table created.');

        const postsTable = `
      CREATE TABLE IF NOT EXISTS user_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;
        await connection.query(postsTable);
        console.log('User Posts table created.');

        // Bookmarks table
        const bookmarksTable = `
      CREATE TABLE IF NOT EXISTS bookmarks (
        user_id INT,
        post_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;
        await connection.query(bookmarksTable);
        console.log('Bookmarks table created.');

    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await connection.end();
    }
}

setup();
