const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Import our database connection

// REGISTER ROUTE: POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // 1. Validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // 2. Check if user already exists
        const [existingUsers] = await db.query(
            "SELECT * FROM users WHERE email = ?", 
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // 3. Hash the password (Security Best Practice)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 4. Insert into Database
        const [result] = await db.query(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            [username, email, passwordHash]
        );

        // 5. Generate JWT Token (Auto-login after registration)
        const token = jwt.sign(
            { id: result.insertId, email: email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: result.insertId, username, email }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

// LOGIN ROUTE: POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // 2. Find user by email
        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?", 
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const user = users[0];

        // 3. Compare passwords (Input vs Hash)
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // 4. Generate Token (Session Key)
        const token = jwt.sign(
            { id: user.user_id, email: user.email }, // Payload
            process.env.JWT_SECRET,                 // Secret Key
            { expiresIn: '1h' }                     // Expiration
        );

        // 5. Send Success Response
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});