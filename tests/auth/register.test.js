jest.mock('../../models/database'); // Automatically use the mock database
jest.mock('../../models/user'); // Mock the user model

const { 
    mockUserModel, 
    makeRequest, 
    handleRegisterDatabaseAssertions, 
    setupMock
} = require('../testHelpers');

const registerScenarios = require('../testScenarios/registerScenarios');
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
            // Replace setupUserMocks with direct calls to setupMock

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
            handleRegisterDatabaseAssertions({ userModel, requestData, expected });
        });
    });
});