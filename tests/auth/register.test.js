jest.mock('../../models/database'); // Automatically use the mock database
jest.mock('../../models/user'); // Mock the user model

const db = require('../../models/database'); // Mocked database
const userModel = require('../../models/user'); // Mocked user model
const request = require('supertest');
const app = require('../../app'); // Import your application

describe('Register User', () => {
  const email = `test${Date.now()}@example.com`; // Unique email for testing
  const password = 'securepassword';

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should register a new user', async () => {
    // Mock findUserByEmail to return null (user does not exist)
    userModel.findUserByEmail.mockResolvedValue(null);

    // Mock createUser to resolve successfully
    userModel.createUser.mockResolvedValue(1); // Simulate user creation with ID 1

    const response = await request(app)
      .post('/auth/register')
      .send({
        email: email,
        password: password,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    expect(userModel.findUserByEmail).toHaveBeenCalledWith(email);
    expect(userModel.createUser).toHaveBeenCalledWith(
      email,
      expect.any(String) // Ensure the hashed password is passed
    );
  });

  it('should not register a user with an existing email', async () => {
    // Mock findUserByEmail to return a user (user already exists)
    userModel.findUserByEmail.mockResolvedValue({ email });

    const response = await request(app)
      .post('/auth/register')
      .send({
        email: email,
        password: password,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
    expect(userModel.findUserByEmail).toHaveBeenCalledWith(email);
    expect(userModel.createUser).not.toHaveBeenCalled();
  });
});