const request = require('supertest');
const app = require('../app');

describe('Auth Routes', () => {
  const email = `test${Date.now()}@example.com`;
  const password = 'securepassword';
  let token;

  // Test user registration
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: email,
        password: password,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should not register a user with an existing email', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: email,
        password: password,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  // Test user login
  it('should log in with correct credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: email,
        password: password,
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token;
  });

  it('should not log in with incorrect credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: email,
        password: 'wrongpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email or password');
  });

  // Test protected route with valid token
  it('should allow access to the protected route with a valid token', async () => {
    const response = await request(app)
      .get('/auth/protected')
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Access granted to protected route');
  });

  // Test protected route with missing token
  it('should return 401 if no token is provided', async () => {
    const response = await request(app)
      .get('/dashboard');  // No token

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token missing');
  });

  // Test protected route with invalid token
  it('should return 403 if an invalid token is provided', async () => {
    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', 'Bearer invalidtoken');  // Invalid token

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Invalid token');
  });
});