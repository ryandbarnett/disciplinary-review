const db = require('../models/database');

const testUsers = [
  { email: 'alice@example.com', password: 'password123', role: 'user' },
  { email: 'bob@example.com', password: 'password123', role: 'user' },
  { email: 'charlie@example.com', password: 'password123', role: 'admin' },
  { email: 'dana@example.com', password: 'password123', role: 'user' },
  { email: 'evan@example.com', password: 'password123', role: 'user' },
];

const populateTestUsers = () => {
  const sql = `INSERT INTO Users (email, password, role) VALUES (?, ?, ?)`;

  db.serialize(() => {
    testUsers.forEach((user) => {
      db.run(sql, [user.email, user.password, user.role], (err) => {
        if (err) {
          console.error(`Failed to insert user ${user.email}:`, err.message);
        } else {
          console.log(`Inserted user: ${user.email}`);
        }
      });
    });
  });

  db.close((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
};

populateTestUsers();