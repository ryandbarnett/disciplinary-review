const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const request = require('supertest');

// Helper for validating login responses
const expectValidLogin = (response, expectedUserId, expectedEmail) => {
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    const decodedToken = jwt.decode(response.body.token);
    expect(decodedToken).toHaveProperty('id', expectedUserId);
    expect(decodedToken).toHaveProperty('email', expectedEmail);
};

// Helper for validating bcrypt.compare calls
const expectBcryptCompare = (plain, hashed) => {
    expect(bcrypt.compare).toHaveBeenCalledWith(plain, hashed);
};

// Helper for validating db.get calls
const expectDbGetCalled = (db, email) => {
    expect(db.get).toHaveBeenCalledWith(
        'SELECT * FROM Users WHERE email = ?',
        [email],
        expect.any(Function)
    );
};

const expectNoDatabaseCalls = (...mocks) => {
    mocks.forEach((mock) => {
        expect(mock).not.toHaveBeenCalled();
    });
};

const expectDatabaseCall = (mock, query, params) => {
    expect(mock).toHaveBeenCalledWith(query, params, expect.any(Function));
};

// Mock bcrypt module
jest.mock('bcrypt', () => ({
    hash: jest.fn(() => Promise.resolve('hashedpassword')),
    hashSync: jest.fn((password, salt) => 'hashedpassword'),
    compare: jest.fn((plain, hashed) => Promise.resolve(plain === 'securepassword' && hashed === 'hashedpassword')), // Simulate password comparison
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

const mockJwtVerify = (isValid = true) => {
    jwt.verify.mockImplementation((token, secret, callback) => {
        if (isValid && token === 'validToken') {
            callback(null, { id: 1, email: 'test@example.com' }); // Simulated valid payload
        } else {
            callback(new Error('Invalid token'));
        }
    });
};

// Helper for making login/register requests
const makeRequest = (app, method, endpoint, options = {}) => {
    const { token, payload } = options;
    const requestBuilder = request(app)[method](endpoint);

    if (token) requestBuilder.set('Authorization', `Bearer ${token}`);

    if (payload) requestBuilder.send(payload);

    return requestBuilder;
};

module.exports = {
    expectNoDatabaseCalls,
    expectDatabaseCall,
    expectValidLogin,
    expectBcryptCompare,
    expectDbGetCalled,  
    mockUserModel,
    mockDbGet,
    mockDbGetError,
    mockJwtVerify,
    makeRequest
};