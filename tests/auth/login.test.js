jest.mock('../../models/database');
jest.mock('bcrypt', () => ({
    compare: jest.fn((plain, hashed) => Promise.resolve(plain === 'securepassword' && hashed === 'hashedpassword')),
}));

const {
    mockDbGet,
    mockDbGetError,
    makeRequest,
    expectValidLogin,
    expectBcryptCompare,
    expectNoDatabaseCalls,
    expectDatabaseCall
} = require('../testHelpers');
const db = require('../../models/database');
const app = require('../../app');

describe('Login User', () => {
    const endpoint = '/auth/login';
    const email = 'test@example.com';
    const password = 'securepassword';

    beforeAll(() => {
        process.env.JWT_SECRET = 'mockSecret';
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should log in with correct credentials and return a valid token', async () => {
        mockDbGet(db, { user_id: 1, email, password: 'hashedpassword' });

        const response = await makeRequest(app, endpoint, { email, password });

        expectValidLogin(response, 1, email);
        expectBcryptCompare(password, 'hashedpassword');
        expectDatabaseCall(db.get, 'SELECT * FROM Users WHERE email = ?', [email]);
    });

    it('should not log in with incorrect credentials', async () => {
        mockDbGet(db, null);

        const response = await makeRequest(app, endpoint, { email, password: 'wrongpassword' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid email or password');

        expectDatabaseCall(db.get, 'SELECT * FROM Users WHERE email = ?', [email]);
    });

    it('should return 400 if email or password is missing', async () => {
        const response = await makeRequest(app, endpoint, { email: '', password });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email and password are required');

        const response2 = await makeRequest(app, endpoint, { email, password: '' });
        expect(response2.status).toBe(400);
        expect(response2.body.message).toBe('Email and password are required');

        expectNoDatabaseCalls(db.get);
    });

    it('should return 500 if a database error occurs', async () => {
        mockDbGetError(db, new Error('Database error'));

        const response = await makeRequest(app, endpoint, { email, password });
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');

        // Ensure the database call was attempted
        expectDatabaseCall(db.get, 'SELECT * FROM Users WHERE email = ?', [email]);
    });
});