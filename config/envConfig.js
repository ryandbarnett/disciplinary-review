const dotenv = require('dotenv');

// Load environment variables from .env file
const loadEnvConfig = () => {
  dotenv.config();
};

module.exports = loadEnvConfig;