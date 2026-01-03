/**
 * Environment configuration
 * Loads and validates environment variables
 */

require('dotenv').config();

const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET',
  'PORT'
];

// Validate that all required environment variables are set
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set in .env file`);
  }
});

module.exports = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'globetrotter',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production',
    expiresIn: '7d'
  },
  server: {
    port: parseInt(process.env.PORT) || 5000
  }
};