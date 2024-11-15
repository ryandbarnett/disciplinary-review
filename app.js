const express = require('express');
const authRoutes = require('./routes/auth');
const { authenticateToken } = require('./middleware/authMiddleware');
const setupMiddleware = require('./middleware');
const loadEnvConfig = require('./config/envConfig');

loadEnvConfig();

const app = express();
const PORT = process.env.PORT || 3000;

setupMiddleware(app);

// Use authentication routes (login, register)
app.use('/auth', authRoutes);

// Protected route for dashboard
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
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

module.exports = app;
