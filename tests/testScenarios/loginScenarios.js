const loginScenarios = [
    {
        description: 'should log in with correct credentials and return a valid token',
        dbMock: { result: { user_id: 1, email: 'test@example.com', password: 'hashedpassword' } },
        requestData: { email: 'test@example.com', password: 'securepassword' },
        expected: {
            status: 200,
            message: null, // No message for successful login
            validLogin: true,
        },
    },
    {
        description: 'should not log in with incorrect credentials',
        dbMock: { result: null },
        requestData: { email: 'test@example.com', password: 'wrongpassword' },
        expected: {
            status: 400,
            message: 'Invalid email or password',
            validLogin: false,
        },
    },
    {
        description: 'should return 400 if email is missing',
        dbMock: {},
        requestData: { email: '', password: 'securepassword' },
        expected: {
            status: 400,
            message: 'Email and password are required',
            noDbCall: true,
        },
    },
    {
        description: 'should return 400 if password is missing',
        dbMock: {},
        requestData: { email: 'test@example.com', password: '' },
        expected: {
            status: 400,
            message: 'Email and password are required',
            noDbCall: true,
        },
    },
    {
        description: 'should return 500 if a database error occurs',
        dbMock: { error: new Error('Database error') },
        requestData: { email: 'test@example.com', password: 'securepassword' },
        expected: {
            status: 500,
            message: 'Internal server error',
            validLogin: false,
        },
    },
];

module.exports = loginScenarios;