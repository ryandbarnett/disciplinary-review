const registerScenarios = [
    {
        description: 'should register a new user',
        userExistsMock: null, // Renamed from mockUserExists
        createUserMockResult: 1, // Renamed from mockCreateUser
        createUserMockError: null, // Added for consistency with other scenarios
        requestData: { email: `test${Date.now()}@example.com`, password: 'securepassword' },
        expected: {
            status: 201,
            message: 'User registered successfully',
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
        },
    },
    {
        description: 'should return 500 on database error',
        userExistsMock: null,
        createUserMockResult: null,
        createUserMockError: new Error('Database error'), // Renamed for consistency
        requestData: { email: `test${Date.now()}@example.com`, password: 'securepassword' },
        expected: {
            status: 500,
            message: 'Internal server error',
        },
    },
];

module.exports = registerScenarios;