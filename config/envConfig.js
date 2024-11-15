const dotenv = require('dotenv');

// Load environment variables from .env file
const loadEnvConfig = () => {
  const result = dotenv.config();
  if (result.error) {
    console.error('Failed to load .env file:', result.error);
    process.exit(1);  // Exit the application if .env loading fails
  }

  // Check if critical environment variables are defined
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is required but not defined in .env file');
    process.exit(1);
  }
};

module.exports = loadEnvConfig;