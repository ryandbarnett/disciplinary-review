const registerScenarios = [
    {
      description: 'should register a new user',
      userExistsMock: null,
      createUserMockResult: 1,
      createUserMockError: null,
      requestData: { email: `test${Date.now()}@example.com`, password: 'securepassword' },
      expected: {
        status: 201,
        message: 'User registered successfully',
        userExists: false,
        noDbCall: false,
      },
    },
    {
      description: 'should not register a user with an existing email',
      userExistsMock: { email: 'existing@example.com' },
      createUserMockResult: null,
      createUserMockError: null,
      requestData: { email: 'existing@example.com', password: 'securepassword' },
      expected: {
        status: 400,
        message: 'User already exists',
        userExists: true,
        noDbCall: false,
      },
    },
    {
      description: 'should return 400 for invalid email',
      userExistsMock: null,
      createUserMockResult: null,
      createUserMockError: null,
      requestData: { email: 'invalid-email', password: 'securepassword' },
      expected: {
        status: 400,
        message: 'Invalid email format',
        userExists: null,
        noDbCall: true,
      },
    },
    {
      description: 'should return 400 for weak password',
      userExistsMock: null,
      createUserMockResult: null,
      createUserMockError: null,
      requestData: { email: `test${Date.now()}@example.com`, password: '123' },
      expected: {
        status: 400,
        message: 'Password does not meet requirements',
        userExists: null,
        noDbCall: true,
      },
    },
    {
      description: 'should return 500 on database error',
      userExistsMock: null,
      createUserMockResult: null,
      createUserMockError: new Error('Database error'),
      requestData: { email: `test${Date.now()}@example.com`, password: 'securepassword' },
      expected: {
        status: 500,
        message: 'Internal server error',
        userExists: false,
        noDbCall: false,
      },
    },
  ];
  
  module.exports = registerScenarios;  