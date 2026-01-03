/**
 * Trip model
 * Represents user trips/travel plans
 */

const db = require('../config/db');

/**
 * Create trips table
 */
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS trips (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT valid_dates CHECK (end_date >= start_date)
    );

    CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
  `;

  try {
    await db.query(query);
    console.log('✓ Trips table ready');
  } catch (error) {
    console.error('Error creating trips table:', error);
  }
};

/**
 * Get all trips for a user
 * @param {number} userId - User ID
 * @returns {Promise<array>} Array of trip objects
 */
const findByUserId = async (userId) => {
  const result = await db.query(
    'SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

/**
 * Get trip by ID
 * @param {number} tripId - Trip ID
 * @param {number} userId - User ID (for authorization check)
 * @returns {Promise<object>} Trip object or null
 */
const findById = async (tripId, userId = null) => {
  let query = 'SELECT * FROM trips WHERE id = $1';
  let params = [tripId];

  if (userId) {
    query += ' AND user_id = $2';
    params.push(userId);
  }

  const result = await db.query(query, params);
  return result.rows[0] || null;
};

/**
 * Create new trip
 * @param {object} tripData - Trip data {user_id, name, description, start_date, end_date}
 * @returns {Promise<object>} Created trip object
 */
const create = async (tripData) => {
  const { user_id, name, description, start_date, end_date } = tripData;
  const result = await db.query(
    'INSERT INTO trips (user_id, name, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user_id, name, description, start_date, end_date]
  );
  return result.rows[0];
};

/**
 * Update trip
 * @param {number} tripId - Trip ID
 * @param {object} tripData - Trip data to update
 * @returns {Promise<object>} Updated trip object
 */
const update = async (tripId, tripData) => {
  const { name, description, start_date, end_date } = tripData;
  const result = await db.query(
    'UPDATE trips SET name = $1, description = $2, start_date = $3, end_date = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
    [name, description, start_date, end_date, tripId]
  );
  return result.rows[0];
};

/**
 * Delete trip
 * @param {number} tripId - Trip ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteTrip = async (tripId) => {
  const result = await db.query(
    'DELETE FROM trips WHERE id = $1 RETURNING id',
    [tripId]
  );
  return result.rows.length > 0;
};

module.exports = {
  createTable,
  findByUserId,
  findById,
  create,
  update,
  deleteTrip
};