/**
 * Trip controller
 * Handles trip operations
 */

const tripModel = require('../models/trip.model');
const budgetModel = require('../models/budget.model');
const budgetService = require('../services/budget.service');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * Get all trips for current user
 * GET /api/trips
 */
const getUserTrips = async (req, res) => {
  try {
    const userId = req.user.id;
    const trips = await tripModel.findByUserId(userId);

    sendSuccess(res, 200, 'Trips retrieved', {
      trips
    });
  } catch (error) {
    console.error('Get trips error:', error);
    sendError(res, 500, 'Error retrieving trips');
  }
};

/**
 * Get trip by ID
 * GET /api/trips/:tripId
 */
const getTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    sendSuccess(res, 200, 'Trip retrieved', {
      trip
    });
  } catch (error) {
    console.error('Get trip error:', error);
    sendError(res, 500, 'Error retrieving trip');
  }
};

/**
 * Create new trip
 * POST /api/trips
 */
const createTrip = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, startDate, endDate } = req.body;

    console.log('Creating trip with:', { userId, name, description, startDate, endDate });

    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
      return sendError(res, 400, 'End date must be after start date');
    }

    // Create trip
    const trip = await tripModel.create({
      user_id: userId,
      name,
      description,
      start_date: startDate,
      end_date: endDate
    });

    console.log('Trip created:', trip);

    // Create budget for trip
    try {
      await budgetModel.create(trip.id, 0);
      console.log('Budget created for trip:', trip.id);
    } catch (budgetError) {
      console.error('Error creating budget, but trip exists:', budgetError);
      // Don't fail trip creation if budget fails
    }

    sendSuccess(res, 201, 'Trip created successfully', {
      trip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    console.error('Error stack:', error.stack);
    sendError(res, 500, 'Error creating trip');
  }
};

/**
 * Update trip
 * PUT /api/trips/:tripId
 */
const updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const { name, description, startDate, endDate } = req.body;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
      return sendError(res, 400, 'End date must be after start date');
    }

    // Update trip
    const updatedTrip = await tripModel.update(tripId, {
      name,
      description,
      start_date: startDate,
      end_date: endDate
    });

    sendSuccess(res, 200, 'Trip updated successfully', {
      trip: updatedTrip
    });
  } catch (error) {
    console.error('Update trip error:', error);
    sendError(res, 500, 'Error updating trip');
  }
};

/**
 * Delete trip
 * DELETE /api/trips/:tripId
 */
const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    // Delete trip
    await tripModel.deleteTrip(tripId);

    sendSuccess(res, 200, 'Trip deleted successfully');
  } catch (error) {
    console.error('Delete trip error:', error);
    sendError(res, 500, 'Error deleting trip');
  }
};

module.exports = {
  getUserTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip
};