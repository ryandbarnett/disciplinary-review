const express = require('express');
const dotenv = require('dotenv');
const db = require('./models/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Express and dotenv are working!');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
