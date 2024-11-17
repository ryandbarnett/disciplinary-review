jest.mock('../../models/database'); // Automatically use the mock database
jest.mock('../../models/user'); // Mock the user model

const { mockUserModel, makeRequest } = require('../testHelpers');
const userModel = require('../../models/user');
const app = require('../../app');

describe('Register User', () => {
	const endpoint = '/auth/register';
	const email = `test${Date.now()}@example.com`; // Unique email for testing
	const password = 'securepassword';

	const { mockFindUserByEmail, mockCreateUser, mockCreateUserError } = mockUserModel(userModel);

	beforeEach(() => {
		jest.clearAllMocks(); // Reset all mocks
	});

	it('should register a new user', async () => {
		mockFindUserByEmail(null); // User does not exist
		mockCreateUser(1); // Simulate successful user creation

		const response = await makeRequest(app, endpoint, { email, password });

		expect(response.status).toBe(201);
		expect(response.body.message).toBe('User registered successfully');
		expect(userModel.findUserByEmail).toHaveBeenCalledWith(email);
		expect(userModel.createUser).toHaveBeenCalledWith(email, expect.any(String)); // Check for hashed password
	});

	it('should not register a user with an existing email', async () => {
		mockFindUserByEmail({ email }); // User exists

		const response = await makeRequest(app, endpoint, { email, password });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe('User already exists');
		expect(userModel.findUserByEmail).toHaveBeenCalledWith(email);
		expect(userModel.createUser).not.toHaveBeenCalled();
	});

	it('should return 400 for invalid email', async () => {
		const invalidEmail = 'invalid-email';

		const response = await makeRequest(app, endpoint, { email: invalidEmail, password });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe('Invalid email format');
		expect(userModel.findUserByEmail).not.toHaveBeenCalled();
		expect(userModel.createUser).not.toHaveBeenCalled();
	});

	it('should return 400 for weak password', async () => {
		const weakPassword = '123'; // Weak password

		const response = await makeRequest(app, endpoint, { email, password: weakPassword });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe('Password does not meet requirements');
		expect(userModel.findUserByEmail).not.toHaveBeenCalled();
		expect(userModel.createUser).not.toHaveBeenCalled();
	});

	it('should return 500 on database error', async () => {
		mockFindUserByEmail(null); // User does not exist
		mockCreateUserError(new Error('Database error')); // Simulate DB error

		const response = await makeRequest(app, endpoint, { email, password });

		expect(response.status).toBe(500);
		expect(response.body.message).toBe('Internal server error');
		expect(userModel.findUserByEmail).toHaveBeenCalledWith(email);
		expect(userModel.createUser).toHaveBeenCalledWith(email, expect.any(String)); // Match any string for hashed password
	});
});
