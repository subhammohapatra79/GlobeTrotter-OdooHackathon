/**
 * Budget controller
 * Handles budget operations
 */

const budgetModel = require('../models/budget.model');
const tripModel = require('../models/trip.model');
const budgetService = require('../services/budget.service');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * Get budget for a trip
 * GET /api/trips/:tripId/budget
 */
const getTripBudget = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    let budget = await budgetModel.findByTripId(tripId);
    if (!budget) {
      // If no budget exists, create one with 0
      budget = await budgetModel.create(tripId, 0);
    }

    sendSuccess(res, 200, 'Budget retrieved', {
      budget
    });
  } catch (error) {
    console.error('Get budget error:', error);
    sendError(res, 500, 'Error retrieving budget');
  }
};

/**
 * Update budget for a trip
 * PUT /api/trips/:tripId/budget
 */
const updateBudget = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const { total_cost } = req.body;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    if (total_cost === undefined || total_cost === null) {
      return sendError(res, 400, 'total_cost is required');
    }

    // Get or create budget
    let budget = await budgetModel.findByTripId(tripId);
    if (!budget) {
      budget = await budgetModel.create(tripId, total_cost);
    } else {
      // Update existing budget
      const query = `
        UPDATE budgets
        SET total_cost = $1, updated_at = CURRENT_TIMESTAMP
        WHERE trip_id = $2
        RETURNING *;
      `;
      const result = await require('../config/db').query(query, [total_cost, tripId]);
      budget = result.rows[0];
    }

    sendSuccess(res, 200, 'Budget updated successfully', {
      budget
    });
  } catch (error) {
    console.error('Update budget error:', error);
    sendError(res, 500, 'Error updating budget');
  }
};

/**
 * Recalculate trip budget
 * POST /api/trips/:tripId/budget/recalculate
 */
const recalculateBudget = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    // Recalculate and update budget
    const budget = await budgetService.updateBudget(tripId);

    sendSuccess(res, 200, 'Budget recalculated', {
      budget
    });
  } catch (error) {
    console.error('Recalculate budget error:', error);
    sendError(res, 500, 'Error recalculating budget');
  }
};

module.exports = {
  getTripBudget,
  updateBudget,
  recalculateBudget
};