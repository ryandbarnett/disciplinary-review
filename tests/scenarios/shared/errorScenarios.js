const errorScenarios = {
    invalidCredentials: {
        status: 400,
        message: 'Invalid email or password',
    },
    missingEmail: {
        status: 400,
        message: 'Email is required',
    },
    missingPassword: {
        status: 400,
        message: 'Password is required',
    },
    dbError: {
        status: 500,
        message: 'Internal server error',
    },
    missingToken: {
        status: 401,
        message: 'Access token missing',
    },
    invalidToken: {
        status: 403,
        message: 'Invalid token',
    },
};

module.exports = errorScenarios;
