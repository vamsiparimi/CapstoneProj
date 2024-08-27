const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Simple validation
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const newUser = new User({ username, email, password });

        // Hash password before saving in database
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        // Save user to database
        const savedUser = await newUser.save();

        // Create and assign a token
        jwt.sign(
            { id: savedUser.id },
            process.env.JWT_SECRET || 'secretKey', // Replace with your secret key in env variables
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: savedUser.id,
                        username: savedUser.username,
                        email: savedUser.email,
                    },
                });
            }
        );
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // Check for existing user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create and assign a token
        jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'secretKey', // Replace with your secret key in env variables
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    },
                });
            }
        );
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    // Perform any necessary cleanup on the server side (if needed)
    res.status(200).json({ msg: 'Logout successful' });
});


module.exports = router;