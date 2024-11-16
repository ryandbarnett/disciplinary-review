jest.mock('../../models/database'); 

const bcrypt = require('bcrypt');
const db = require('../../models/database');
const request = require('supertest');
const app = require('../../app');

describe('Login User', () => {
	const email = 'test@example.com';
	const password = 'securepassword';

	beforeEach(() => {
		jest.clearAllMocks(); // Clear mocks before each test
	});

	it('should log in with correct credentials', async () => {
		db.get.mockImplementation((query, params, callback) => {
			const hashedPassword = bcrypt.hashSync(password, 10); // Simulate hashed password
			callback(null, { email, password: hashedPassword }); // Simulated user
		});

		const response = await request(app)
			.post('/auth/login')
			.send({
				email: email,
				password: password,
			});

		expect(response.status).toBe(200);
		expect(response.body.token).toBeDefined();
	});

	it('should not log in with incorrect credentials', async () => {
		db.get.mockImplementation((query, params, callback) => {
			callback(null, null); // No user found
		});

		const response = await request(app)
			.post('/auth/login')
			.send({
				email: email,
				password: 'wrongpassword',
			});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe('Invalid email or password');
	});
});