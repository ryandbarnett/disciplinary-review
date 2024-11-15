const request = require('supertest');
const app = require('../../app'); // Import the app for testing

describe('Login User', () => {
  const email = `test${Date.now()}@example.com`;  // Ensure unique email for each test
  const password = 'securepassword';

  // First, create a user for login tests
  beforeAll(async () => {
    await request(app)
      .post('/auth/register')
      .send({
        email: email,
        password: password,
      });
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
});