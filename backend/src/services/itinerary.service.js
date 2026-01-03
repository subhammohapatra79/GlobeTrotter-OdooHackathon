/**
 * Itinerary service
 * Handles complex itinerary operations
 */

const tripModel = require('../models/trip.model');
const tripStopModel = require('../models/tripStop.model');
const activityModel = require('../models/activity.model');
const budgetService = require('./budget.service');

/**
 * Get complete itinerary for a trip
 * Includes trip, all stops, all activities, and budget
 * @param {number} tripId - Trip ID
 * @returns {Promise<object>} Complete itinerary
 */
const getCompleteItinerary = async (tripId) => {
  try {
    // Get trip
    const trip = await tripModel.findById(tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Get all stops for the trip
    const stops = await tripStopModel.findByTripId(tripId);

    // Get all activities for each stop
    const stopsWithActivities = await Promise.all(
      stops.map(async (stop) => {
        const activities = await activityModel.findByStopId(stop.id);
        return {
          ...stop,
          activities
        };
      })
    );

    // Get budget
    const budget = await budgetService.getBudgetDetails(tripId);

    return {
      trip,
      stops: stopsWithActivities,
      budget: budget || { total_cost: 0 }
    };
  } catch (error) {
    throw new Error('Error getting itinerary: ' + error.message);
  }
};

module.exports = {
  getCompleteItinerary
};