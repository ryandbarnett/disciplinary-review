jest.mock('../../models/database'); // Mock the database if required
jest.mock('jsonwebtoken'); // Mock the JWT library

const { makeRequest, mockJwtVerify } = require('../testHelpers');
const app = require('../../app');

describe('Protected Route', () => {
    const endpoint = '/dashboard';
    const validToken = 'validToken';
    const invalidToken = 'invalidToken';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const tokenScenarios = [
        {
            description: 'no token is provided',
            token: undefined,
            expectedStatus: 401,
            expectedMessage: 'Access token missing',
            mockVerify: null, // No mocking needed for missing token
        },
        {
            description: 'an invalid token is provided',
            token: invalidToken,
            expectedStatus: 403,
            expectedMessage: 'Invalid token',
            mockVerify: false, // Mock invalid token behavior
        },
        {
            description: 'a valid token is provided',
            token: validToken,
            expectedStatus: 200,
            expectedMessage: 'Access granted to protected route',
            mockVerify: true, // Mock valid token behavior
        },
    ];

    it.each(tokenScenarios)(
        'should return $expectedStatus when $description',
        async ({ token, expectedStatus, expectedMessage, mockVerify }) => {
            if (mockVerify !== null) {
                mockJwtVerify(mockVerify);
            }

            const response = await makeRequest(app, 'get', endpoint, { token });

            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedMessage);
        }
    );
});