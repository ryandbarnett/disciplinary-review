const request = require('supertest');

// Mock bcrypt module
jest.mock('bcrypt', () => ({
    hash: jest.fn(() => Promise.resolve('hashedpassword')),
    hashSync: jest.fn((password, salt) => 'hashedpassword'),
    compare: jest.fn((plain, hashed) => Promise.resolve(plain === hashed)), // Simulate password comparison
}));
  

// Mock userModel methods
const mockUserModel = (userModel) => ({
    mockFindUserByEmail: (result) => userModel.findUserByEmail.mockResolvedValue(result),
    mockCreateUser: (result) => userModel.createUser.mockResolvedValue(result),
    mockCreateUserError: (error) => userModel.createUser.mockRejectedValue(error),
});

// Mock db.get method
const mockDbGet = (db, result) => {
    db.get.mockImplementation((query, params, callback) => {
        callback(null, result);
    });
};

// Mock db.get error
const mockDbGetError = (db, error) => {
    db.get.mockImplementation((query, params, callback) => {
        callback(error);
    });
};

// Helper for making login/register requests
const makeRequest = (app, endpoint, payload) => request(app).post(endpoint).send(payload);

module.exports = {
  mockUserModel,
  mockDbGet,
  mockDbGetError,
  makeRequest,
};