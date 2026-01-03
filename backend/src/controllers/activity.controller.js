/**
 * Activity controller
 * Handles activity operations
 */

const activityModel = require('../models/activity.model');
const tripStopModel = require('../models/tripStop.model');
const tripModel = require('../models/trip.model');
const budgetService = require('../services/budget.service');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * Get all activities for a stop
 * GET /api/trips/:tripId/stops/:stopId/activities
 */
const getActivities = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const userId = req.user.id;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    // Check stop exists and belongs to trip
    const stop = await tripStopModel.findById(stopId);
    if (!stop || stop.trip_id !== parseInt(tripId)) {
      return sendError(res, 404, 'Stop not found');
    }

    const activities = await activityModel.findByStopId(stopId);
    sendSuccess(res, 200, 'Activities retrieved', {
      activities
    });
  } catch (error) {
    console.error('Get activities error:', error);
    sendError(res, 500, 'Error retrieving activities');
  }
};

/**
 * Get activity by ID
 * GET /api/trips/:tripId/stops/:stopId/activities/:activityId
 */
const getActivity = async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;
    const userId = req.user.id;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    // Check stop exists and belongs to trip
    const stop = await tripStopModel.findById(stopId);
    if (!stop || stop.trip_id !== parseInt(tripId)) {
      return sendError(res, 404, 'Stop not found');
    }

    const activity = await activityModel.findById(activityId);
    if (!activity || activity.trip_stop_id !== parseInt(stopId)) {
      return sendError(res, 404, 'Activity not found');
    }

    sendSuccess(res, 200, 'Activity retrieved', {
      activity
    });
  } catch (error) {
    console.error('Get activity error:', error);
    sendError(res, 500, 'Error retrieving activity');
  }
};

/**
 * Create new activity
 * POST /api/trips/:tripId/stops/:stopId/activities
 */
const createActivity = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const userId = req.user.id;
    const { name, description, cost, durationHours, category } = req.body;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    // Check stop exists and belongs to trip
    const stop = await tripStopModel.findById(stopId);
    if (!stop || stop.trip_id !== parseInt(tripId)) {
      return sendError(res, 404, 'Stop not found');
    }

    // Create activity
    const activity = await activityModel.create({
      trip_stop_id: stopId,
      name,
      description,
      cost: parseFloat(cost),
      duration_hours: parseFloat(durationHours),
      category
    });

    // Update trip budget
    await budgetService.updateBudget(tripId);

    sendSuccess(res, 201, 'Activity created successfully', {
      activity
    });
  } catch (error) {
    console.error('Create activity error:', error);
    sendError(res, 500, 'Error creating activity');
  }
};

/**
 * Update activity
 * PUT /api/trips/:tripId/stops/:stopId/activities/:activityId
 */
const updateActivity = async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;
    const userId = req.user.id;
    const { name, description, cost, durationHours, category } = req.body;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    // Check stop exists and belongs to trip
    const stop = await tripStopModel.findById(stopId);
    if (!stop || stop.trip_id !== parseInt(tripId)) {
      return sendError(res, 404, 'Stop not found');
    }

    // Check activity exists and belongs to stop
    const activity = await activityModel.findById(activityId);
    if (!activity || activity.trip_stop_id !== parseInt(stopId)) {
      return sendError(res, 404, 'Activity not found');
    }

    // Update activity
    const updatedActivity = await activityModel.update(activityId, {
      name,
      description,
      cost: parseFloat(cost),
      duration_hours: parseFloat(durationHours),
      category
    });

    // Update trip budget
    await budgetService.updateBudget(tripId);

    sendSuccess(res, 200, 'Activity updated successfully', {
      activity: updatedActivity
    });
  } catch (error) {
    console.error('Update activity error:', error);
    sendError(res, 500, 'Error updating activity');
  }
};

/**
 * Delete activity
 * DELETE /api/trips/:tripId/stops/:stopId/activities/:activityId
 */
const deleteActivity = async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;
    const userId = req.user.id;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    // Check stop exists and belongs to trip
    const stop = await tripStopModel.findById(stopId);
    if (!stop || stop.trip_id !== parseInt(tripId)) {
      return sendError(res, 404, 'Stop not found');
    }

    // Check activity exists and belongs to stop
    const activity = await activityModel.findById(activityId);
    if (!activity || activity.trip_stop_id !== parseInt(stopId)) {
      return sendError(res, 404, 'Activity not found');
    }

    // Delete activity
    await activityModel.deleteActivity(activityId);

    // Update trip budget
    await budgetService.updateBudget(tripId);

    sendSuccess(res, 200, 'Activity deleted successfully');
  } catch (error) {
    console.error('Delete activity error:', error);
    sendError(res, 500, 'Error deleting activity');
  }
};

module.exports = {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity
};