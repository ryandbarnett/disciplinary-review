const dbMockScenarios = require('../shared/dbMockScenarios');
const requestDataScenarios = require('../shared/requestDataScenarios');
const expectedScenarios = require('../shared/expectedScenarios');

const DESCRIPTIONS = {
    success: {
        validLogin: 'should log in successfully with correct credentials and return a valid token',
    },
    errors: {
        invalidCredentials: 'should return a 400 status with an error message when the credentials are incorrect',
        missingEmail: 'should return a 400 status when the email is missing from the login request',
        missingPassword: 'should return a 400 status when the password is missing from the login request',
        dbError: 'should return a 500 status when a database error occurs during login attempt',
    },
};

const loginScenarios = [
    {
        description: DESCRIPTIONS.success.validLogin,
        dbMock: dbMockScenarios.validUser,
        requestData: requestDataScenarios.validCredentials,
        expected: expectedScenarios.successes.successLogin,
    },
    {
        description: DESCRIPTIONS.errors.invalidCredentials,
        dbMock: dbMockScenarios.noUser,
        requestData: requestDataScenarios.incorrectPassword,
        expected: expectedScenarios.errors.invalidCredentials,
    },
    {
        description: DESCRIPTIONS.errors.missingEmail,
        dbMock: dbMockScenarios.missingDbCall,
        requestData: requestDataScenarios.missingEmail,
        expected: expectedScenarios.errors.missingEmail,
    },
    {
        description: DESCRIPTIONS.errors.missingPassword,
        dbMock: dbMockScenarios.missingDbCall,
        requestData: requestDataScenarios.missingPassword,
        expected: expectedScenarios.errors.missingPassword,
    },
    {
        description: DESCRIPTIONS.errors.dbError,
        dbMock: dbMockScenarios.dbError,
        requestData: requestDataScenarios.validCredentials,
        expected: expectedScenarios.errors.internalServerError,
    },
];

module.exports = loginScenarios;