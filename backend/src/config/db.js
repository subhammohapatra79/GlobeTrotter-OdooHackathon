/**
 * Database connection pool
 * Manages PostgreSQL connections
 */

const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password
});

// Log successful connection
pool.on('connect', () => {
  console.log('✓ Database connected');
});

// Log connection errors
pool.on('error', (err) => {
  console.error('✗ Unexpected connection pool error:', err);
});

/**
 * Execute a query
 * @param {string} text - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Executed query (${duration}ms)`, { text, params });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

module.exports = {
  query,
  pool
};