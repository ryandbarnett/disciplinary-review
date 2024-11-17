// utilityHelpers.js
const jwt = require('jsonwebtoken');

const mockJwtVerify = (isValid = true) => {
  jwt.verify.mockImplementation((token, secret, callback) => {
    if (isValid && token === 'validToken') {
      callback(null, { id: 1, email: 'test@example.com' });
    } else {
      callback(new Error('Invalid token'));
    }
  });
};

module.exports = {
  mockJwtVerify,
};