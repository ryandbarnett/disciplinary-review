jest.mock('../../models/database'); // Automatically use the mock database
jest.mock('../../models/user'); // Mock the user model

const { mockUserModel, makeRequest, expectNoDatabaseCalls, expectOnlyErrorMockedCalls } = require('../testHelpers');
const registerScenarios = require('../testScenarios/registerScenarios');
const userModel = require('../../models/user');
const app = require('../../app');

describe('Register User', () => {
    const endpoint = '/auth/register';
    const { mockFindUserByEmail, mockCreateUser, mockCreateUserError } = mockUserModel(userModel);

    beforeEach(() => {
        jest.clearAllMocks(); // Reset all mocks
    });

    registerScenarios.forEach(({ description, mockUserExists, mockCreateUser: createUserMock, mockCreateUserError: createUserErrorMock, requestData, expected }) => {
        it(description, async () => {
            // Mock user existence check
            if (mockUserExists) {
                mockFindUserByEmail(mockUserExists);
            } else {
                mockFindUserByEmail(null);
            }

            // Mock user creation errors or success
            if (createUserErrorMock) {
                mockCreateUserError(createUserErrorMock);
            } else if (createUserMock) {
                mockCreateUser(createUserMock);
            }

            // Perform the request
            const response = await makeRequest(app, 'post', endpoint, { payload: requestData });

            // Validate the response
            expect(response.status).toBe(expected.status);
            expect(response.body.message).toBe(expected.message);

            // Validate database calls
            if (expected.status === 201) {
                expect(userModel.createUser).toHaveBeenCalledWith(
                    requestData.email,
                    expect.any(String) // Ensure password hashing occurred
                );
            } else if (expected.status === 500) {
                expectOnlyErrorMockedCalls(userModel.createUser);
            } else {
                expectNoDatabaseCalls(userModel.createUser);
            }
        });
    });
});