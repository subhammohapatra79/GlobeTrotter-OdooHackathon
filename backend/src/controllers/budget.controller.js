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

    const budget = await budgetModel.findByTripId(tripId);
    if (!budget) {
      return sendError(res, 404, 'Budget not found');
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
  recalculateBudget
};