jest.mock('../../models/database', () => ({
    get: jest.fn(),
}));

const db = require('../../models/database'); // Mocked database
const { findUserByEmail } = require('../../models/user');

describe('findUserByEmail', () => {
    const email = 'test@example.com';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should resolve with user data if user exists', async () => {
        // Mock the db.get method to simulate a user found
        db.get.mockImplementation((query, params, callback) => {
            callback(null, { email, password: 'hashedpassword' });
        });

        const user = await findUserByEmail(email);
        expect(user).toEqual({ email, password: 'hashedpassword' });
        expect(db.get).toHaveBeenCalledWith(
            'SELECT * FROM Users WHERE email = ?',
            [email],
            expect.any(Function)
        );
    });

    it('should resolve with null if no user is found', async () => {
        // Mock the db.get method to simulate no user found
        db.get.mockImplementation((query, params, callback) => {
            callback(null, null);
        });

        const user = await findUserByEmail(email);
        expect(user).toBeNull();
        expect(db.get).toHaveBeenCalledWith(
            'SELECT * FROM Users WHERE email = ?',
            [email],
            expect.any(Function)
        );
    });

    it('should reject with an error if db.get fails', async () => {
        // Mock the db.get method to simulate an error
        db.get.mockImplementation((query, params, callback) => {
            callback(new Error('Database error'));
        });

        await expect(findUserByEmail(email)).rejects.toThrow('Database error');
        expect(db.get).toHaveBeenCalledWith(
            'SELECT * FROM Users WHERE email = ?',
            [email],
            expect.any(Function)
        );
    });
});  