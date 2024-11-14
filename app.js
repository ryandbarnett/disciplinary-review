const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');  // Import authentication routes
const { authenticateToken } = require('./middleware/authMiddleware');  // Import the authentication middleware

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files (frontend assets)
app.use(express.static(path.join(__dirname, 'public')));

// Use authentication routes (login, register)
app.use('/auth', authRoutes);

// Protected route for dashboard
app.get('/dashboard', authenticateToken, (req, res) => {
  res.send('Welcome to the dashboard');
});

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Express and dotenv are working!');
});

// Start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;  // Export the app for testing
