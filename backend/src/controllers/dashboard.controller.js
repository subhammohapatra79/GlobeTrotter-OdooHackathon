/**
 * Dashboard controller
 * Handles dashboard data
 */

const tripModel = require('../models/trip.model');
const budgetModel = require('../models/budget.model');
const { sendSuccess } = require('../utils/response.util');

/**
 * Get dashboard summary
 * GET /api/dashboard
 */
const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get trips with budget
    const trips = await tripModel.findByUserId(userId);

    // Calculate total budget
    const totalBudget = trips.reduce((sum, trip) => sum + (parseFloat(trip.budget) || 0), 0);

    // Get total trips count
    const totalTrips = trips.length;

    // Get upcoming trips (start_date > now)
    const now = new Date().toISOString().split('T')[0];
    const upcomingTrips = trips.filter(trip => trip.start_date > now);

    sendSuccess(res, 200, 'Dashboard summary retrieved', {
      summary: {
        totalTrips,
        totalBudget,
        upcomingTrips: upcomingTrips.length
      },
      recentTrips: trips.slice(0, 5) // Last 5 trips
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    sendError(res, 500, 'Error retrieving dashboard data');
  }
};

module.exports = {
  getDashboardSummary
};