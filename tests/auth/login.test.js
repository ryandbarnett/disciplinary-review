jest.mock('../../models/database');
jest.mock('bcrypt', () => ({
    compare: jest.fn((plain, hashed) => Promise.resolve(plain === 'securepassword' && hashed === 'hashedpassword')),
}));

const {
    makeRequest,
    mockDbGet,
    mockDbGetError,
    expectValidLogin,
    expectBcryptCompare,
    expectNoDatabaseCalls,
    expectDatabaseCall,
} = require('../testHelpers');
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
            if (dbMock.error) {
                mockDbGetError(db, dbMock.error);
            } else {
                mockDbGet(db, dbMock.result);
            }
        
            const response = await makeRequest(app, 'post', endpoint, { payload: requestData });
        
            expect(response.status).toBe(expected.status);
        
            if ('message' in expected) {
                expect(response.body.message || null).toBe(expected.message);
            }
        
            if (expected.validLogin) {
                expectValidLogin(response, dbMock.result.user_id, requestData.email);
                expectBcryptCompare(requestData.password, dbMock.result.password);
                expectDatabaseCall(db.get, 'SELECT * FROM Users WHERE email = ?', [requestData.email]);
            } else if (expected.noDbCall) {
                expectNoDatabaseCalls(db.get);
            } else {
                expectDatabaseCall(db.get, 'SELECT * FROM Users WHERE email = ?', [requestData.email]);
            }
        });             
    });
});