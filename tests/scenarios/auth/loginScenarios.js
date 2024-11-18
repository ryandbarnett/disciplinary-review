const dbMockScenarios = require('../shared/dbMockScenarios');
const errorScenarios = require('../shared/errorScenarios');
const requestDataScenarios = require('../shared/requestDataScenarios');

const loginScenarios = [
    {
        description: 'should log in successfully with correct credentials and return a valid token',
        dbMock: dbMockScenarios.validUser,
        requestData: requestDataScenarios.validCredentials,
        expected: {
            status: 200,
            message: null,
            validLogin: true,
        },
    },
    {
        description: 'should return a 400 status with an error message when the credentials are incorrect',
        dbMock: dbMockScenarios.noUser,
        requestData: requestDataScenarios.incorrectPassword,
        expected: errorScenarios.invalidCredentials,
    },
    {
        description: 'should return a 400 status when the email is missing from the login request',
        dbMock: dbMockScenarios.missingDbCall,
        requestData: requestDataScenarios.missingEmail,
        expected: errorScenarios.missingEmail,
    },
    {
        description: 'should return a 400 status when the password is missing from the login request',
        dbMock: dbMockScenarios.missingDbCall,
        requestData: requestDataScenarios.missingPassword,
        expected: errorScenarios.missingPassword,
    },
    {
        description: 'should return a 500 status when a database error occurs during login attempt',
        dbMock: dbMockScenarios.dbError,
        requestData: requestDataScenarios.validCredentials,
        expected: errorScenarios.dbError,
    },
];

module.exports = loginScenarios;
