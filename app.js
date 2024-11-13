const express = require('express');
const dotenv = require('dotenv');
const db = require('./models/database'); // Import database connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Import and use auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Express and dotenv are working!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
