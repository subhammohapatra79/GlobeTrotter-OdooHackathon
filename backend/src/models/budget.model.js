/**
 * Budget model
 * Tracks trip budget and costs
 */

const db = require('../config/db');

/**
 * Create budgets table
 */
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS budgets (
      id SERIAL PRIMARY KEY,
      trip_id INTEGER UNIQUE NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
      total_cost DECIMAL(10, 2) DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT valid_budget_cost CHECK (total_cost >= 0)
    );

    CREATE INDEX IF NOT EXISTS idx_budgets_trip_id ON budgets(trip_id);
  `;

  try {
    await db.query(query);
    console.log('✓ Budgets table ready');
  } catch (error) {
    console.error('Error creating budgets table:', error);
  }
};

/**
 * Get budget for a trip
 * @param {number} tripId - Trip ID
 * @returns {Promise<object>} Budget object or null
 */
const findByTripId = async (tripId) => {
  const result = await db.query(
    'SELECT * FROM budgets WHERE trip_id = $1',
    [tripId]
  );
  return result.rows[0] || null;
};

/**
 * Create budget for a trip
 * @param {number} tripId - Trip ID
 * @param {number} totalCost - Total cost
 * @returns {Promise<object>} Created budget object
 */
const create = async (tripId, totalCost = 0) => {
  const result = await db.query(
    'INSERT INTO budgets (trip_id, total_cost) VALUES ($1, $2) RETURNING *',
    [tripId, totalCost]
  );
  return result.rows[0];
};

/**
 * Update budget total cost
 * @param {number} tripId - Trip ID
 * @param {number} totalCost - New total cost
 * @returns {Promise<object>} Updated budget object
 */
const updateTotalCost = async (tripId, totalCost) => {
  const result = await db.query(
    'UPDATE budgets SET total_cost = $1, updated_at = CURRENT_TIMESTAMP WHERE trip_id = $2 RETURNING *',
    [totalCost, tripId]
  );
  return result.rows[0];
};

/**
 * Get total cost for a trip (sum of all activities)
 * @param {number} tripId - Trip ID
 * @returns {Promise<number>} Total cost
 */
const calculateTotalCost = async (tripId) => {
  const result = await db.query(
    `SELECT COALESCE(SUM(a.cost), 0) as total_cost
     FROM activities a
     JOIN trip_stops ts ON a.trip_stop_id = ts.id
     WHERE ts.trip_id = $1`,
    [tripId]
  );
  return parseFloat(result.rows[0].total_cost);
};

module.exports = {
  createTable,
  findByTripId,
  create,
  updateTotalCost,
  calculateTotalCost
};