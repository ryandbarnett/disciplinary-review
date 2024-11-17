const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const request = require('supertest');

const checkResponse = (response, expected) => {
    expect(response.status).toBe(expected.status);
    if ('message' in expected) {
        expect(response.body.message || null).toBe(expected.message);
    }
};

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

const expectOnlyErrorMockedCalls = (mock, expectedCallCount = 1) => {
    expect(mock).toHaveBeenCalledTimes(expectedCallCount);
};

const handleDatabaseAssertions = (db, requestData, dbMock, expected, response) => {
    if (expected.validLogin) {
        validateSuccessfulLogin(response, dbMock, requestData, db);
    } else if (expected.noDbCall) {
        expectNoDatabaseCalls(db.get);
    } else {
        expectDatabaseCall(db.get, 'SELECT * FROM Users WHERE email = ?', [requestData.email]);
    }
};

const handleRegisterDatabaseAssertions = ({ userModel, requestData, expected }) => {
    if (expected.status === 201) {
      // Successful registration
      expect(userModel.createUser).toHaveBeenCalledWith(
        requestData.email,
        expect.any(String) // Ensure password hashing occurred
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(requestData.password, expect.any(Number));
    } else if (expected.status === 500) {
      // Internal server error occurred during user creation
      expectOnlyErrorMockedCalls(userModel.createUser);
    } else {
      // For other error cases, ensure createUser was not called
      expectNoDatabaseCalls(userModel.createUser);
    }
  };

// Mock bcrypt module
jest.mock('bcrypt', () => ({
    hash: jest.fn(() => Promise.resolve('hashedpassword')),
    hashSync: jest.fn((password, salt) => 'hashedpassword'),
    compare: jest.fn((plain, hashed) => Promise.resolve(plain === 'securepassword' && hashed === 'hashedpassword')), // Simulate password comparison
}));

// Mock userModel methods
const mockUserModel = (userModel) => {
    userModel.findUserByEmail = jest.fn();
    userModel.createUser = jest.fn();

    return {
        mockFindUserByEmail: userModel.findUserByEmail,
        mockCreateUser: userModel.createUser,
        mockCreateUserError: userModel.createUser,
    };
};

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

const setupDbMock = (db, dbMock) => {
    if (dbMock.error) {
        mockDbGetError(db, dbMock.error);
    } else {
        mockDbGet(db, dbMock.result);
    }
};

const setupMock = (mockFunction, result = null, error = null) => {
    if (error) {
        mockFunction.mockRejectedValue(error);
    } else {
        mockFunction.mockResolvedValue(result);
    }
};

const setupUserMocks = ({
    mockFindUserByEmail,
    mockCreateUser,
    mockCreateUserError,
    userExistsMock,
    createUserMockResult,
    createUserMockError,
  }) => {
    // Mock user existence
    mockFindUserByEmail(userExistsMock || null);
  
    // Mock user creation (success or error)
    if (createUserMockError) {
      mockCreateUserError(createUserMockError);
    } else {
      mockCreateUser(createUserMockResult || null);
    }
};

const validateSuccessfulLogin = (response, dbMock, requestData, db) => {
    if (!dbMock.result) {
        throw new Error('dbMock.result is required for a valid login scenario');
    }

    expectValidLogin(response, dbMock.result.user_id, requestData.email);
    expectBcryptCompare(requestData.password, dbMock.result.password);
    expectDatabaseCall(db.get, 'SELECT * FROM Users WHERE email = ?', [requestData.email]);
};

module.exports = {
    checkResponse,
    expectNoDatabaseCalls,
    expectDatabaseCall,
    expectValidLogin,
    expectBcryptCompare,
    expectDbGetCalled,
    expectOnlyErrorMockedCalls,
    handleDatabaseAssertions,
    handleRegisterDatabaseAssertions,  
    mockUserModel,
    mockDbGet,
    mockDbGetError,
    mockJwtVerify,
    makeRequest,
    setupDbMock,
    setupMock,
    setupUserMocks,
    validateSuccessfulLogin
};