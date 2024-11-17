jest.mock('../../models/database'); // Mock the database if required
jest.mock('jsonwebtoken'); // Mock the JWT library

const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../app');

// Helper to mock JWT verification
const mockJwtVerify = (isValid = true) => {
	jwt.verify.mockImplementation((token, secret, callback) => {
		if (isValid && token === 'validToken') {
			callback(null, { id: 1, email: 'test@example.com' }); // Simulated valid payload
		} else {
			callback(new Error('Invalid token'));
		}
	});
};

// Helper to make requests to the protected route
const makeRequest = (token) => {
	const requestBuilder = request(app).get('/dashboard');
	return token ? requestBuilder.set('Authorization', `Bearer ${token}`) : requestBuilder;
};

describe('Protected Route', () => {
	let validToken;

	beforeAll(() => {
		validToken = 'validToken'; // Use a hardcoded valid token
	});

	it('should allow access to the protected route with a valid token', async () => {
		mockJwtVerify(true); // Mock valid token
		const response = await makeRequest(validToken);

		expect(response.status).toBe(200);
		expect(response.body.message).toBe('Access granted to protected route');
	});

	it('should return 401 if no token is provided', async () => {
		const response = await makeRequest();

		expect(response.status).toBe(401);
		expect(response.body.message).toBe('Access token missing');
	});

	it('should return 403 if an invalid token is provided', async () => {
		mockJwtVerify(false); // Mock invalid token
		const response = await makeRequest('invalidToken');

		expect(response.status).toBe(403);
		expect(response.body.message).toBe('Invalid token');
	});
});
