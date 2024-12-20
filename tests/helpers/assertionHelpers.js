const jwt = require('jsonwebtoken');

const checkResponse = (response, expected) => {
	expect(response.status).toBe(expected.status);
	if (expected.message) {
		expect(response.body.message).toBe(expected.message);
	}
};

const handleDatabaseAssertions = (db, requestData, dbMock, expected, response) => {
	if (dbMock === null || expected.noDbCall) {
		expect(db.get).not.toHaveBeenCalled();
	} else {
		expect(db.get).toHaveBeenCalledWith(
			'SELECT * FROM Users WHERE email = ?',
			[requestData.email],
			expect.any(Function)
		);
	}
};

const handleRegisterDatabaseAssertions = ({ userModel, requestData, expected }) => {
	if (expected.noDbCall) {
		expect(userModel.findUserByEmail).not.toHaveBeenCalled();
		expect(userModel.createUser).not.toHaveBeenCalled();
	} else {
		// Check if findUserByEmail was called
		expect(userModel.findUserByEmail).toHaveBeenCalledWith(requestData.email);

		// If the user exists, createUser should not be called
		if (expected.userExists === true) {
			expect(userModel.createUser).not.toHaveBeenCalled();
		} else {
			// If the user does not exist, createUser should be called
			expect(userModel.createUser).toHaveBeenCalledWith(
				requestData.email,
				expect.any(String)
			);
		}
	}
};

module.exports = {
  checkResponse,
  handleDatabaseAssertions,
  handleRegisterDatabaseAssertions
};