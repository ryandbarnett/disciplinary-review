const dbScenarios = require('../shared/dbScenarios');
const errorScenarios = require('../shared/errorScenarios');

const loginScenarios = [
    {
        description: 'should log in successfully with correct credentials and return a valid token',
        dbMock: {
            result: dbScenarios.validUser,
            error: null,
        },
        requestData: { email: 'test@example.com', password: 'securepassword' },
        expected: {
            status: 200,
            message: null,
            validLogin: true,
        },
    },
    {
        description: 'should return a 400 status with an error message when the credentials are incorrect',
        dbMock: {
            result: dbScenarios.noUser,
            error: null,
        },
        requestData: { email: 'test@example.com', password: 'wrongpassword' },
        expected: errorScenarios.invalidCredentials,
    },
    {
        description: 'should return a 400 status when the email is missing from the login request',
        dbMock: null, // No database call expected
        requestData: { email: '', password: 'securepassword' },
        expected: errorScenarios.missingEmail,
    },
    {
        description: 'should return a 400 status when the password is missing from the login request',
        dbMock: null, // No database call expected
        requestData: { email: 'test@example.com', password: '' },
        expected: errorScenarios.missingPassword,
    },
    {
        description: 'should return a 500 status when a database error occurs during login attempt',
        dbMock: {
            result: null,
            error: dbScenarios.dbError,
        },
        requestData: { email: 'test@example.com', password: 'securepassword' },
        expected: errorScenarios.dbError,
    },
];

module.exports = loginScenarios;