const request = require('supertest');
const app = require('../../app');

describe('Register User', () => {
  const email = `test${Date.now()}@example.com`;  // Ensure unique email for each test
  const password = 'securepassword';

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
});