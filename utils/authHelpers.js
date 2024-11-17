const jwt = require('jsonwebtoken');

// Generate a JWT
const generateToken = (id, email) => {
  const payload = { id, email }; // Include both id and email in the payload
  const secret = process.env.JWT_SECRET || 'defaultSecret';
  const options = { expiresIn: '1h' }; // Set an expiration time if needed
  return jwt.sign(payload, secret, options);
};

// Handle errors and standardize responses
const handleError = (res, error, message) => {
  console.error(error);  // Log the error for debugging
  res.status(500).json({ message });
};

module.exports = { generateToken, handleError };
