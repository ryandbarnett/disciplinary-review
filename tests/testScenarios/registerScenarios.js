const registerScenarios = [
    {
        description: 'should register a new user',
        mockUserExists: null,
        mockCreateUser: 1,
        requestData: { email: `test${Date.now()}@example.com`, password: 'securepassword' },
        expected: {
            status: 201,
            message: 'User registered successfully',
        },
    },
    {
        description: 'should not register a user with an existing email',
        mockUserExists: { email: 'existing@example.com' },
        mockCreateUser: null,
        requestData: { email: 'existing@example.com', password: 'securepassword' },
        expected: {
            status: 400,
            message: 'User already exists',
        },
    },
    {
        description: 'should return 400 for invalid email',
        mockUserExists: null,
        mockCreateUser: null,
        requestData: { email: 'invalid-email', password: 'securepassword' },
        expected: {
            status: 400,
            message: 'Invalid email format',
        },
    },
    {
        description: 'should return 400 for weak password',
        mockUserExists: null,
        mockCreateUser: null,
        requestData: { email: `test${Date.now()}@example.com`, password: '123' },
        expected: {
            status: 400,
            message: 'Password does not meet requirements',
        },
    },
    {
        description: 'should return 500 on database error',
        mockUserExists: null,
        mockCreateUserError: new Error('Database error'),
        requestData: { email: `test${Date.now()}@example.com`, password: 'securepassword' },
        expected: {
            status: 500,
            message: 'Internal server error',
        },
    },
];

module.exports = registerScenarios;