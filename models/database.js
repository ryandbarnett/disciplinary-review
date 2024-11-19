const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path for the database file
const dbPath = path.resolve(__dirname, '../data/disciplinaryReview.db');

// Connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
});

// Define the tables
db.serialize(() => {
  // Create Users table
  db.run(`CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user', -- Can be 'admin' or 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create Infractions table
  db.run(`CREATE TABLE IF NOT EXISTS Infractions (
    infraction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Pending',
    created_by INTEGER, -- Links to the admin who created this infraction
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
  )`);

  // Create Voters table
  db.run(`CREATE TABLE IF NOT EXISTS Voters (
    voter_id INTEGER PRIMARY KEY AUTOINCREMENT,
    infraction_id INTEGER NOT NULL, -- Links to the infraction being voted on
    user_id INTEGER NOT NULL, -- Links to the user assigned to vote
    has_voted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (infraction_id) REFERENCES Infractions(infraction_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
  )`);

  // Create Votes table
  db.run(`CREATE TABLE IF NOT EXISTS Votes (
    vote_id INTEGER PRIMARY KEY AUTOINCREMENT,
    infraction_id INTEGER NOT NULL, -- Links to the infraction being voted on
    voter_id INTEGER NOT NULL, -- Links to the voter casting the vote
    vote TEXT CHECK (vote IN ('YES', 'NO')), -- Ensures only 'YES' or 'NO' votes
    comments TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (infraction_id) REFERENCES Infractions(infraction_id),
    FOREIGN KEY (voter_id) REFERENCES Voters(voter_id)
  )`);
});

module.exports = db;