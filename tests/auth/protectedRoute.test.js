const request = require('supertest');
const app = require('../../app'); // Import the app for testing

describe('Protected Route', () => {
  let validToken;
  
  // Create a valid token for testing
  beforeAll(async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',  // Replace with a test user
        password: 'securepassword', // Replace with the correct password
      });

    validToken = response.body.token;
  });

  // Test if protected route returns success with valid token
  it('should allow access to the protected route with a valid token', async () => {
    const response = await request(app)
      .get('/dashboard')  // Protected route
      .set('Authorization', `Bearer ${validToken}`);  // Add token to headers

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Access granted to protected route');
  });

  // Test if protected route returns 401 if no token is provided
  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/dashboard');  // No token

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token missing');
  });

  // Test if protected route returns 403 for invalid token
  it('should return 403 if an invalid token is provided', async () => {
    const response = await request(app)
      .get('/dashboard')  // Protected route
      .set('Authorization', 'Bearer invalidtoken');  // Invalid token

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Invalid token');
  });
});
