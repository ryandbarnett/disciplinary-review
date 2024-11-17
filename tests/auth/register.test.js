jest.mock('../../models/database'); // Automatically use the mock database
jest.mock('../../models/user'); // Mock the user model
jest.mock('bcrypt', () => ({
	hash: jest.fn(() => Promise.resolve('hashedpassword')),
}));

const userModel = require('../../models/user'); // Mocked user model
const bcrypt = require('bcrypt'); // Mocked bcrypt
const request = require('supertest');
const app = require('../../app'); // Import your application

describe('Register User', () => {
	const email = `test${Date.now()}@example.com`; // Unique email for testing
	const password = 'securepassword';

	beforeEach(() => {
		jest.clearAllMocks(); // Clear mocks before each test
	});

	it('should register a new user', async () => {
		userModel.findUserByEmail.mockResolvedValue(null); // User does not exist
		userModel.createUser.mockResolvedValue(1); // Simulate user creation

		const response = await request(app)
			.post('/auth/register')
			.send({ email, password });

		expect(response.status).toBe(201);
		expect(response.body.message).toBe('User registered successfully');
		expect(userModel.findUserByEmail).toHaveBeenCalledWith(email);
		expect(userModel.createUser).toHaveBeenCalledWith(email, 'hashedpassword');
		expect(bcrypt.hash).toHaveBeenCalledWith(password, expect.any(Number));
	});

	it('should not register a user with an existing email', async () => {
		userModel.findUserByEmail.mockResolvedValue({ email }); // User exists

		const response = await request(app)
			.post('/auth/register')
			.send({ email, password });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe('User already exists');
		expect(userModel.findUserByEmail).toHaveBeenCalledWith(email);
		expect(userModel.createUser).not.toHaveBeenCalled();
	});

	it('should return 400 for invalid email', async () => {
		const response = await request(app)
			.post('/auth/register')
			.send({ email: 'invalid-email', password });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe('Invalid email format');
		expect(userModel.findUserByEmail).not.toHaveBeenCalled();
		expect(userModel.createUser).not.toHaveBeenCalled();
	});

	it('should return 400 for weak password', async () => {
		const response = await request(app)
			.post('/auth/register')
			.send({ email, password: '123' }); // Weak password

		expect(response.status).toBe(400);
		expect(response.body.message).toBe('Password does not meet requirements');
		expect(userModel.findUserByEmail).not.toHaveBeenCalled();
		expect(userModel.createUser).not.toHaveBeenCalled();
	});

	it('should return 500 on database error', async () => {
		userModel.findUserByEmail.mockResolvedValue(null); // User does not exist
		userModel.createUser.mockRejectedValue(new Error('Database error')); // Simulate DB error

		const response = await request(app)
			.post('/auth/register')
			.send({ email, password });

		expect(response.status).toBe(500);
		expect(response.body.message).toBe('Internal server error');
		expect(userModel.findUserByEmail).toHaveBeenCalledWith(email);
		expect(userModel.createUser).toHaveBeenCalledWith(email, 'hashedpassword');
	});
});
