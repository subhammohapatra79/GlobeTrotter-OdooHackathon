/**
 * Activity model
 * Represents activities within trip stops
 */

const db = require('../config/db');

/**
 * Create activities table
 */
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      trip_stop_id INTEGER NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      cost DECIMAL(10, 2) DEFAULT 0.00,
      duration_hours DECIMAL(5, 2) DEFAULT 0,
      category VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT valid_cost CHECK (cost >= 0),
      CONSTRAINT valid_duration CHECK (duration_hours >= 0)
    );

    CREATE INDEX IF NOT EXISTS idx_activities_trip_stop_id ON activities(trip_stop_id);
  `;

  try {
    await db.query(query);
    console.log('✓ Activities table ready');
  } catch (error) {
    console.error('Error creating activities table:', error);
  }
};

/**
 * Get all activities for a trip stop
 * @param {number} stopId - Trip stop ID
 * @returns {Promise<array>} Array of activity objects
 */
const findByStopId = async (stopId) => {
  const result = await db.query(
    'SELECT * FROM activities WHERE trip_stop_id = $1 ORDER BY created_at ASC',
    [stopId]
  );
  return result.rows;
};

/**
 * Get activity by ID
 * @param {number} activityId - Activity ID
 * @returns {Promise<object>} Activity object or null
 */
const findById = async (activityId) => {
  const result = await db.query(
    'SELECT * FROM activities WHERE id = $1',
    [activityId]
  );
  return result.rows[0] || null;
};

/**
 * Create new activity
 * @param {object} activityData - Activity data {trip_stop_id, name, description, cost, duration_hours, category}
 * @returns {Promise<object>} Created activity object
 */
const create = async (activityData) => {
  const { trip_stop_id, name, description, cost, duration_hours, category } = activityData;
  const result = await db.query(
    'INSERT INTO activities (trip_stop_id, name, description, cost, duration_hours, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [trip_stop_id, name, description, cost || 0, duration_hours || 0, category]
  );
  return result.rows[0];
};

/**
 * Update activity
 * @param {number} activityId - Activity ID
 * @param {object} activityData - Activity data to update
 * @returns {Promise<object>} Updated activity object
 */
const update = async (activityId, activityData) => {
  const { name, description, cost, duration_hours, category } = activityData;
  const result = await db.query(
    'UPDATE activities SET name = $1, description = $2, cost = $3, duration_hours = $4, category = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
    [name, description, cost, duration_hours, category, activityId]
  );
  return result.rows[0];
};

/**
 * Delete activity
 * @param {number} activityId - Activity ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteActivity = async (activityId) => {
  const result = await db.query(
    'DELETE FROM activities WHERE id = $1 RETURNING id',
    [activityId]
  );
  return result.rows.length > 0;
};

module.exports = {
  createTable,
  findByStopId,
  findById,
  create,
  update,
  deleteActivity
};