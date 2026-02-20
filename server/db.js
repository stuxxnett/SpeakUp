const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool (Better performance than a single connection)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert the pool to use Promises (So we can use async/await)
const promisePool = pool.promise();

console.log("Connected to MySQL Database: SpeakUp");

module.exports = promisePool;