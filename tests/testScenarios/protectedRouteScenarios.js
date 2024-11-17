module.exports = [
    {
        description: 'should allow access to the protected route with a valid token',
        token: 'validToken',
        mockValid: true,
        expectedStatus: 200,
        expectedMessage: 'Access granted to protected route',
    },
    {
        description: 'should return 401 if no token is provided',
        token: null,
        mockValid: null,
        expectedStatus: 401,
        expectedMessage: 'Access token missing',
    },
    {
        description: 'should return 403 if an invalid token is provided',
        token: 'invalidToken',
        mockValid: false,
        expectedStatus: 403,
        expectedMessage: 'Invalid token',
    },
];