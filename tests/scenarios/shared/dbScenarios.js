const dbScenarios = {
    validUser: { user_id: 1, email: 'test@example.com', password: 'hashedpassword' },
    userExists: { email: 'existing@example.com' },
    noUser: null,
    dbError: new Error('Database error'),
};

module.exports = dbScenarios;