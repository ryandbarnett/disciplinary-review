const dbScenarios = {
    validUser: { user_id: 1, email: 'test@example.com', password: 'hashedpassword' },
    userExists: { email: 'existing@example.com' },
    dbError: new Error('Database error')
};

module.exports = dbScenarios;