const express = require('express');
const dotenv = require('dotenv');
const db = require('./models/database'); // Import database connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Express and dotenv are working!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});