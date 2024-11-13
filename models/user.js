const db = require('./database');

// Find a user by email
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM Users WHERE email = ?`, [email], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

// Create a new user
const createUser = (email, password) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO Users (email, password) VALUES (?, ?)`, [email, password], function (err) {
      if (err) reject(err);
      resolve(this.lastID);
    });
  });
};

module.exports = { findUserByEmail, createUser };