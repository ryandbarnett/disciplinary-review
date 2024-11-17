jest.mock('../../models/database');
jest.mock('bcrypt', () => ({
    compare: jest.fn((plain, hashed) => Promise.resolve(plain === 'securepassword' && hashed === 'hashedpassword')),
}));

const { checkResponse, makeRequest, setupDbMock, handleDatabaseAssertions } = require('../testHelpers');
const loginScenarios = require('../testScenarios/loginScenarios');
const db = require('../../models/database');
const app = require('../../app');

describe('Login User', () => {
    const endpoint = '/auth/login';

    beforeAll(() => {
        process.env.JWT_SECRET = 'mockSecret';
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    loginScenarios.forEach(({ description, dbMock, requestData, expected }) => {
        it(description, async () => {
            setupDbMock(db, dbMock);
        
            const response = await makeRequest(app, 'post', endpoint, { payload: requestData });
        
            checkResponse(response, expected)

            handleDatabaseAssertions(db, requestData, dbMock, expected, response);
        });             
    });
});