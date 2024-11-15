const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const { generateToken, handleError } = require('../utils/authHelpers');

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);

    // Validate user and password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token and respond
    const token = generateToken(user.user_id);
    res.json({ token });
  } catch (error) {
    handleError(res, error, 'Server error');
  }
};

module.exports = { loginUser };