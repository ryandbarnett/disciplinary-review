const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const { handleError } = require('../utils/authHelpers');

// Register user
const registerUser = async (req, res) => {
	const { email, password } = req.body;
	
	const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	if (!isValidEmail(email)) {
		return res.status(400).json({ message: 'Invalid email format' });
	}

	const isStrongPassword = (password) => password.length >= 8;
	if (!isStrongPassword(password)) {
		return res.status(400).json({ message: 'Password does not meet requirements' });
	}
  
	try {
		if (await userModel.findUserByEmail(email)) {
			return res.status(400).json({ message: 'User already exists' });
		}
  
		const hashedPassword = await bcrypt.hash(password, Number(process.env.HASH_ROUNDS) || 10);
		await userModel.createUser(email, hashedPassword);
  
	  	res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
	  	handleError(res, error, 'Internal server error');
	}
};
  
module.exports = { registerUser };