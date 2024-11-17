jest.mock('../../models/database');
jest.mock('jsonwebtoken');


const { makeRequest } = require('../helpers/requestHelpers');
const { mockJwtVerify } = require('../helpers/utilityHelpers');
const app = require('../../app');
const scenarios = require('../testScenarios/protectedRouteScenarios');

describe('Protected Route', () => {
    const endpoint = '/dashboard';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    scenarios.forEach(({ description, token, mockValid, expectedStatus, expectedMessage }) => {
        it(description, async () => {
            if (mockValid !== null) {
                mockJwtVerify(mockValid);
            }
            const response = await makeRequest(app, 'get', endpoint, { token });
            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedMessage);
        });
    });
});