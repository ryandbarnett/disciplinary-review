const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const { generateToken, handleError } = require('../utils/authHelpers');

// Register user
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    if (await userModel.findUserByEmail(email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, Number(process.env.HASH_ROUNDS) || 10);
    await userModel.createUser(email, hashedPassword);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    handleError(res, error, 'Server error');
  }
};

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

module.exports = { registerUser, loginUser };