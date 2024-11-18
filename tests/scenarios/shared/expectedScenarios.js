const expectedScenarios = {
    errors: {
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
        internalServerError: {
            status: 500,
            message: 'Internal server error',
        },
    },
    successes: {
        successLogin: {
            status: 200,
            message: null, // No error message for successful login
            validLogin: true,
        },
        userRegistered: {
            status: 201,
            message: 'User registered successfully',
        },
    },
};

module.exports = expectedScenarios;
