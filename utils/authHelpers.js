const jwt = require('jsonwebtoken');

// Generate a JWT
const generateToken = (id, email) => {
  const payload = { id, email }; // Include both id and email in the payload
  const secret = process.env.JWT_SECRET || 'defaultSecret';
  const options = { expiresIn: '1h' }; // Set an expiration time if needed
  return jwt.sign(payload, secret, options);
};

// utils/authHelpers.js
const handleError = (res, error, message) => {
  if (process.env.NODE_ENV !== 'test') {
      console.error(error); // Log only if not in test environment
  }
  res.status(500).json({ message });
};

module.exports = { generateToken, handleError };
