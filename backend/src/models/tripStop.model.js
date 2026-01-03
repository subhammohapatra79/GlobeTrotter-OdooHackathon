/**
 * TripStop model
 * Represents city stops within a trip
 */

const db = require('../config/db');

/**
 * Create trip_stops table
 */
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS trip_stops (
      id SERIAL PRIMARY KEY,
      trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
      city VARCHAR(100) NOT NULL,
      country VARCHAR(100),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT valid_stop_dates CHECK (end_date >= start_date)
    );

    CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON trip_stops(trip_id);
  `;

  try {
    await db.query(query);
    console.log('✓ TripStops table ready');
  } catch (error) {
    console.error('Error creating trip_stops table:', error);
  }
};

/**
 * Get all stops for a trip
 * @param {number} tripId - Trip ID
 * @returns {Promise<array>} Array of trip stop objects
 */
const findByTripId = async (tripId) => {
  const result = await db.query(
    'SELECT * FROM trip_stops WHERE trip_id = $1 ORDER BY start_date ASC',
    [tripId]
  );
  return result.rows;
};

/**
 * Get trip stop by ID
 * @param {number} stopId - Trip stop ID
 * @returns {Promise<object>} Trip stop object or null
 */
const findById = async (stopId) => {
  const result = await db.query(
    'SELECT * FROM trip_stops WHERE id = $1',
    [stopId]
  );
  return result.rows[0] || null;
};

/**
 * Create new trip stop
 * @param {object} stopData - Stop data {trip_id, city, country, start_date, end_date, notes}
 * @returns {Promise<object>} Created trip stop object
 */
const create = async (stopData) => {
  const { trip_id, city, country, start_date, end_date, notes } = stopData;
  const result = await db.query(
    'INSERT INTO trip_stops (trip_id, city, country, start_date, end_date, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [trip_id, city, country, start_date, end_date, notes]
  );
  return result.rows[0];
};

/**
 * Update trip stop
 * @param {number} stopId - Trip stop ID
 * @param {object} stopData - Stop data to update
 * @returns {Promise<object>} Updated trip stop object
 */
const update = async (stopId, stopData) => {
  const { city, country, start_date, end_date, notes } = stopData;
  const result = await db.query(
    'UPDATE trip_stops SET city = $1, country = $2, start_date = $3, end_date = $4, notes = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
    [city, country, start_date, end_date, notes, stopId]
  );
  return result.rows[0];
};

/**
 * Delete trip stop
 * @param {number} stopId - Trip stop ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteStop = async (stopId) => {
  const result = await db.query(
    'DELETE FROM trip_stops WHERE id = $1 RETURNING id',
    [stopId]
  );
  return result.rows.length > 0;
};

module.exports = {
  createTable,
  findByTripId,
  findById,
  create,
  update,
  deleteStop
};