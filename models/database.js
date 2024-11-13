const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path for the database file
const dbPath = path.resolve(__dirname, 'disciplinaryReview.db');

// Connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Define the tables
db.serialize(() => {
  // Create Users table
  db.run(`CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create Infractions table
  db.run(`CREATE TABLE IF NOT EXISTS Infractions (
    infraction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Pending'
  )`);

  // Create Voters table
  db.run(`CREATE TABLE IF NOT EXISTS Voters (
    voter_id INTEGER PRIMARY KEY AUTOINCREMENT,
    infraction_id INTEGER,
    email TEXT NOT NULL,
    has_voted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (infraction_id) REFERENCES Infractions(infraction_id)
  )`);

  // Create Votes table
  db.run(`CREATE TABLE IF NOT EXISTS Votes (
    vote_id INTEGER PRIMARY KEY AUTOINCREMENT,
    infraction_id INTEGER,
    voter_id INTEGER,
    vote TEXT NOT NULL,
    comments TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (infraction_id) REFERENCES Infractions(infraction_id),
    FOREIGN KEY (voter_id) REFERENCES Voters(voter_id)
  )`);

  console.log('Database tables created (if they did not already exist)');
});

module.exports = db;