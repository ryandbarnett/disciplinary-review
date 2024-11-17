const loginScenarios = [
    {
        description: 'should log in successfully with correct credentials and return a valid token',
        dbMock: { result: { user_id: 1, email: 'test@example.com', password: 'hashedpassword' } },
        requestData: { email: 'test@example.com', password: 'securepassword' },
        expected: {
            status: 200,
            message: null, // No message for successful login
            validLogin: true,
        },
    },
    {
        description: 'should return a 400 status with an error message when the credentials are incorrect',
        dbMock: { result: null },
        requestData: { email: 'test@example.com', password: 'wrongpassword' },
        expected: {
            status: 400,
            message: 'Invalid email or password',
            validLogin: false,
        },
    },
    {
        description: 'should return a 400 status when the email is missing from the login request',
        dbMock: {},
        requestData: { email: '', password: 'securepassword' },
        expected: {
            status: 400,
            message: 'Email is required',
            noDbCall: true,
        },
    },
    {
        description: 'should return a 400 status when the password is missing from the login request',
        dbMock: {},
        requestData: { email: 'test@example.com', password: '' },
        expected: {
            status: 400,
            message: 'Password is required',
            noDbCall: true,
        },
    },
    {
        description: 'should return a 500 status when a database error occurs during login attempt',
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