const express = require('express');
const { registerUser } = require('../controllers/registerController');
const { loginUser } = require('../controllers/loginController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Register and Login routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
});

module.exports = router;