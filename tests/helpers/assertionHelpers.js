// assertionHelpers.js
const jwt = require('jsonwebtoken');

const checkResponse = (response, expected) => {
  expect(response.status).toBe(expected.status);
  if (expected.message) {
    expect(response.body.message).toBe(expected.message);
  }
};

const handleDatabaseAssertions = (db, requestData, dbMock, expected, response) => {
  if (expected.noDbCall) {
    expect(db.get).not.toHaveBeenCalled();
  } else {
    expect(db.get).toHaveBeenCalledWith(
      'SELECT * FROM Users WHERE email = ?',
      [requestData.email],
      expect.any(Function)
    );

    if (expected.validLogin) {
      expect(response.body.token).toBeDefined();
      const decodedToken = jwt.decode(response.body.token);
      expect(decodedToken).toHaveProperty('id', dbMock.result.user_id);
      expect(decodedToken).toHaveProperty('email', dbMock.result.email);
    }
  }
};

module.exports = {
  checkResponse,
  handleDatabaseAssertions,
};