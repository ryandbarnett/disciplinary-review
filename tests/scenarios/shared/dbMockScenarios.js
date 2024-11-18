const dbScenarios = require('./dbScenarios');

// Helper function to generate mock objects
const generateDbMock = (result, error = null) => ({ result, error });

const dbMockScenarios = {
    validUser: generateDbMock(dbScenarios.validUser),
    noUser: generateDbMock(null),
    dbError: generateDbMock(null, dbScenarios.dbError),
    missingDbCall: null, // Represents no database interaction
};

module.exports = dbMockScenarios;