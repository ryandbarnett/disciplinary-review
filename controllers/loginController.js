const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const { generateToken, handleError } = require('../utils/authHelpers');

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	// Check for missing fields
	if (!email || !password) {
		return res.status(400).json({ message: 'Email and password are required' });
	}

	try {
		const user = await userModel.findUserByEmail(email);

		// Validate user and password
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}

		// Generate token with user_id and email
		const token = generateToken(user.user_id, user.email);
		res.json({ token });
	} catch (error) {
		handleError(res, error, 'Internal server error');
	}
};

module.exports = { loginUser };