jest.mock('../../models/database', () => ({
    get: jest.fn(),
    run: jest.fn(),
  }));
  
  const db = require('../../models/database'); // Mocked database
  const { findUserByEmail, createUser } = require('../../models/user'); // Replace with the actual path
  
  describe('User Model', () => {
    const email = 'test@example.com';
    const password = 'securepassword';
  
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mocks between tests
    });
  
    describe('findUserByEmail', () => {
      it('should resolve with user data if user exists', async () => {
        // Mock db.get to simulate finding a user
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
        // Mock db.get to simulate no user found
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
        // Mock db.get to simulate a database error
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
  
    describe('createUser', () => {
        it('should resolve with lastID when user is successfully created', async () => {
            // Mock db.run to simulate successful user creation
            db.run.mockImplementation(function (query, params, callback) {
                const mockThis = { lastID: 1 }; // Simulate the context of "this"
                callback.call(mockThis, null); // Call the callback with the mocked "this"
            });
        
            const userId = await createUser(email, password);
            expect(userId).toBe(1); // Check if lastID is resolved correctly
            expect(db.run).toHaveBeenCalledWith(
                'INSERT INTO Users (email, password) VALUES (?, ?)',
                [email, password],
                expect.any(Function)
            );
        });
  
      it('should reject with an error for duplicate email', async () => {
        // Mock db.run to simulate a unique constraint error
        db.run.mockImplementation((query, params, callback) => {
          const error = new Error('SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.email');
          callback(error);
        });
  
        await expect(createUser(email, password)).rejects.toThrow(
          'SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.email'
        );
        expect(db.run).toHaveBeenCalledWith(
          'INSERT INTO Users (email, password) VALUES (?, ?)',
          [email, password],
          expect.any(Function)
        );
      });
  
      it('should reject with a general database error', async () => {
        // Mock db.run to simulate a general database error
        db.run.mockImplementation((query, params, callback) => {
          const error = new Error('Database error');
          callback(error);
        });
  
        await expect(createUser(email, password)).rejects.toThrow('Database error');
        expect(db.run).toHaveBeenCalledWith(
          'INSERT INTO Users (email, password) VALUES (?, ?)',
          [email, password],
          expect.any(Function)
        );
      });
    });
  });
  