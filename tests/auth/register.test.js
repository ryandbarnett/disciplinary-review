jest.mock('../../models/database'); // Automatically use the mock database
jest.mock('../../models/user'); // Mock the user model
jest.mock('bcrypt', () => ({
    hash: jest.fn(() => Promise.resolve('hashedpassword')), // Mocked hashed password
}));

const { makeRequest } = require('../helpers/requestHelpers');
const { mockUserModel, setupMock } = require('../helpers/mockHelpers');
const { handleRegisterDatabaseAssertions } = require('../helpers/assertionHelpers');

const registerScenarios = require('../scenarios/auth/registerScenarios');
const userModel = require('../../models/user');
const app = require('../../app');

describe('Register User', () => {
    const endpoint = '/auth/register';
    const { 
        mockFindUserByEmail, 
        mockCreateUser, 
        mockCreateUserError 
    } = mockUserModel(userModel);

    beforeEach(() => {
        jest.clearAllMocks(); // Reset all mocks
    });

    registerScenarios.forEach(({
        description, 
        userExistsMock, 
        createUserMockResult, 
        createUserMockError, 
        requestData, 
        expected
    }) => {
        it(description, async () => {
            // Mock user existence
            setupMock(mockFindUserByEmail, userExistsMock || null);

            // Mock user creation (success or error)
            setupMock(
                createUserMockError ? mockCreateUserError : mockCreateUser,
                createUserMockResult,
                createUserMockError
            );

            // Perform the request
            const response = await makeRequest(app, 'post', endpoint, { payload: requestData });

            // Validate the response
            expect(response.status).toBe(expected.status);
            if (expected.message) {
                expect(response.body.message).toBe(expected.message);
            }

            // Validate database interactions
            handleRegisterDatabaseAssertions({ userModel, requestData, expected, response });
        });
    });
});