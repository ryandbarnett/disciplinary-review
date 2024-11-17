jest.mock('../../models/database'); 

const bcrypt = require('bcrypt');
const db = require('../../models/database');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');

// Helper to mock db.get
const mockDbGet = (user = null) => {
	db.get.mockImplementation((query, params, callback) => {
		callback(null, user);
	});
};

// Helper to make login requests
const makeLoginRequest = (email, password) => {
	return request(app)
		.post('/auth/login')
		.send({ email, password });
};

describe('Login User', () => {
	const email = 'test@example.com';
	const password = 'securepassword';
	let hashedPassword;

	beforeEach(() => {
		jest.clearAllMocks(); // Clear mocks before each test
		hashedPassword = bcrypt.hashSync(password, 10); // Simulate hashed password
	});

	it('should log in with correct credentials and return a valid token', async () => {
		mockDbGet({ user_id: 1, email, password: hashedPassword });


		const response = await makeLoginRequest(email, password);

		expect(response.status).toBe(200);
		expect(response.body.token).toBeDefined();

		// Decode the token to validate its structure
		const decodedToken = jwt.decode(response.body.token); // Decode without verifying
		expect(decodedToken).toHaveProperty('id');
		expect(decodedToken).toHaveProperty('email', email);

		// Verify the token signature
		const secret = process.env.JWT_SECRET || 'defaultSecret'; // Replace with your actual secret
		const verifiedToken = jwt.verify(response.body.token, secret);
		expect(verifiedToken).toHaveProperty('id');
		expect(verifiedToken).toHaveProperty('email', email);
	});

	it('should log in with correct credentials', async () => {
		mockDbGet({ user_id: 1, email, password: hashedPassword });

		const response = await makeLoginRequest(email, password);

		expect(response.status).toBe(200);
		expect(response.body.token).toBeDefined();
		expect(db.get).toHaveBeenCalledWith(
			'SELECT * FROM Users WHERE email = ?',
			[email],
			expect.any(Function)
		);
	});

	it('should not log in with incorrect credentials', async () => {
		mockDbGet(null); // Mock db.get to return no user

		const response = await makeLoginRequest(email, 'wrongpassword');

		expect(response.status).toBe(400);
		expect(response.body.message).toBe('Invalid email or password');
	});

	it('should return 400 if email or password is missing', async () => {
		const response = await makeLoginRequest('', password); // Missing email
		expect(response.status).toBe(400);
		expect(response.body.message).toBe('Email and password are required');

		const response2 = await makeLoginRequest(email, ''); // Missing password
		expect(response2.status).toBe(400);
		expect(response2.body.message).toBe('Email and password are required');
	});

	it('should return 500 if a database error occurs', async () => {
		db.get.mockImplementation((query, params, callback) => {
			callback(new Error('Database error'));
		});

		const response = await makeLoginRequest(email, password);
		expect(response.status).toBe(500);
		expect(response.body.message).toBe('Internal server error');
	});
});
