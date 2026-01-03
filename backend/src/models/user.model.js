/**
 * User model
 * Represents application users
 */

const db = require('../config/db');

/**
 * Create users table
 */
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `;

  try {
    await db.query(query);
    console.log('✓ Users table ready');
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<object>} User object or null
 */
const findByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
};

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<object>} User object or null
 */
const findById = async (id) => {
  const result = await db.query(
    'SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Create new user
 * @param {object} userData - User data {email, password_hash, first_name, last_name}
 * @returns {Promise<object>} Created user object
 */
const create = async (userData) => {
  const { email, password_hash, first_name, last_name } = userData;
  const result = await db.query(
    'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, created_at',
    [email, password_hash, first_name, last_name]
  );
  return result.rows[0];
};

module.exports = {
  createTable,
  findByEmail,
  findById,
  create
};