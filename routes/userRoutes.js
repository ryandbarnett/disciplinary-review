const express = require('express');
const router = express.Router();
const db = require('../models/database');

// Fetch all users for the dashboard
router.get('/api/users', (req, res) => {
  db.all(`SELECT user_id, email, role, created_at FROM Users`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(rows);
  });
});

module.exports = router;