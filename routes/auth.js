const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models/database'); // Import database connection

const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    db.get(`SELECT * FROM Users WHERE email = ?`, [email], async (err, row) => {
      if (row) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into the database
      db.run(`INSERT INTO Users (email, password) VALUES (?, ?)`, [email, hashedPassword], (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error registering user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
