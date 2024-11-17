// mockHelpers.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const setupMock = (mockFunction, result = null, error = null) => {
  if (error) {
    mockFunction.mockRejectedValue(error);
  } else {
    mockFunction.mockResolvedValue(result);
  }
};

const setupCallbackMock = (mockFunction, result = null, error = null) => {
  mockFunction.mockImplementation((...args) => {
    const callback = args[args.length - 1];
    callback(error, result);
  });
};

const mockUserModel = (userModel) => {
  userModel.findUserByEmail = jest.fn();
  userModel.createUser = jest.fn();

  return {
    mockFindUserByEmail: userModel.findUserByEmail,
    mockCreateUser: userModel.createUser,
    mockCreateUserError: userModel.createUser,
  };
};

module.exports = {
  setupMock,
  setupCallbackMock,
  mockUserModel,
};