/**
 * User Profile model
 * Extends user information
 */

const db = require('../config/db');

/**
 * Create user_profiles table
 */
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      phone_number VARCHAR(20),
      city VARCHAR(100),
      country VARCHAR(100),
      additional_info TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
  `;

  try {
    await db.query(query);
    console.log('Ensuring user_profiles table exists');
  } catch (error) {
    console.error('Error ensuring user_profiles table exists:', error);
  }
};

/**
 * Find profile by user ID
 * @param {number} userId - User ID
 * @returns {Promise<object>} Profile object or null
 */
const findByUserId = async (userId) => {
  try {
    const result = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user profile:', error);
    throw error;
  }
};

/**
 * Create user profile
 * @param {object} profileData - Profile data
 * @returns {Promise<object>} Created profile
 */
const create = async (profileData) => {
  const { userId, firstName, lastName, phoneNumber, city, country, additionalInfo } = profileData;
  try {
    const query = `
      INSERT INTO user_profiles (user_id, first_name, last_name, phone_number, city, country, additional_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [userId, firstName, lastName, phoneNumber, city, country, additionalInfo];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {object} profileData - Profile data
 * @returns {Promise<object>} Updated profile
 */
const update = async (userId, profileData) => {
  const { firstName, lastName, phoneNumber, city, country, additionalInfo } = profileData;
  try {
    const query = `
      UPDATE user_profiles
      SET first_name = $1, last_name = $2, phone_number = $3, city = $4, country = $5, additional_info = $6, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $7
      RETURNING *;
    `;
    const values = [firstName, lastName, phoneNumber, city, country, additionalInfo, userId];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

module.exports = {
  createTable,
  findByUserId,
  create,
  update
};