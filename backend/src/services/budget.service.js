/**
 * Budget service
 * Handles budget calculation logic
 */

const budgetModel = require('../models/budget.model');
const activityModel = require('../models/activity.model');

/**
 * Calculate and update trip budget
 * Sums all activity costs within trip stops
 * @param {number} tripId - Trip ID
 * @returns {Promise<object>} Updated budget object
 */
const updateBudget = async (tripId) => {
  try {
    // Calculate total cost from all activities
    const totalCost = await budgetModel.calculateTotalCost(tripId);
    
    // Update budget
    let budget = await budgetModel.findByTripId(tripId);
    
    if (!budget) {
      // Create budget if it doesn't exist
      budget = await budgetModel.create(tripId, totalCost);
    } else {
      // Update existing budget
      budget = await budgetModel.updateTotalCost(tripId, totalCost);
    }
    
    return budget;
  } catch (error) {
    throw new Error('Error updating budget: ' + error.message);
  }
};

/**
 * Get budget details for a trip
 * @param {number} tripId - Trip ID
 * @returns {Promise<object>} Budget with trip details
 */
const getBudgetDetails = async (tripId) => {
  try {
    const budget = await budgetModel.findByTripId(tripId);
    if (!budget) {
      return null;
    }
    return budget;
  } catch (error) {
    throw new Error('Error getting budget: ' + error.message);
  }
};

module.exports = {
  updateBudget,
  getBudgetDetails
};