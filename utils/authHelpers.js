const jwt = require('jsonwebtoken');

// Generate a JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Handle errors and standardize responses
const handleError = (res, error, message) => {
  console.error(error);  // Log the error for debugging
  res.status(500).json({ message });
};

module.exports = { generateToken, handleError };
