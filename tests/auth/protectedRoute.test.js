jest.mock('../../models/database'); // Mock the database if required
jest.mock('jsonwebtoken'); // Mock the JWT library

const { makeRequest, mockJwtVerify } = require('../testHelpers');
const request = require('supertest');
const app = require('../../app');

describe('Protected Route', () => {
	let validToken;

	beforeAll(() => {
		validToken = 'validToken';
	});

	it('should allow access to the protected route with a valid token', async () => {
		mockJwtVerify(true);
		const response = await makeRequest(app, 'get', '/dashboard', { token: validToken });

		expect(response.status).toBe(200);
		expect(response.body.message).toBe('Access granted to protected route');
	});

	it('should return 401 if no token is provided', async () => {
		const response = await makeRequest(app, 'get', '/dashboard');

		expect(response.status).toBe(401);
		expect(response.body.message).toBe('Access token missing');
	});

	it('should return 403 if an invalid token is provided', async () => {
		mockJwtVerify(false);
		const response = await makeRequest(app, 'get', '/dashboard', { token: 'invalidToken' });

		expect(response.status).toBe(403);
		expect(response.body.message).toBe('Invalid token');
	});
});
