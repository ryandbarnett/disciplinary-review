const requestDataScenarios = {
    validCredentials: { email: 'test@example.com', password: 'securepassword' },
    incorrectPassword: { email: 'test@example.com', password: 'wrongpassword' },
    missingEmail: { email: '', password: 'securepassword' },
    missingPassword: { email: 'test@example.com', password: '' }
};

module.exports = requestDataScenarios;
