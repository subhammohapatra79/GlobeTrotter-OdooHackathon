/**
 * Trip Stop controller
 * Handles city stop operations
 */

const tripStopModel = require('../models/tripStop.model');
const tripModel = require('../models/trip.model');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * Get all stops for a trip
 * GET /api/trips/:tripId/stops
 */
const getTripStops = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    const stops = await tripStopModel.findByTripId(tripId);
    sendSuccess(res, 200, 'Stops retrieved', {
      stops
    });
  } catch (error) {
    console.error('Get stops error:', error);
    sendError(res, 500, 'Error retrieving stops');
  }
};

/**
 * Get stop by ID
 * GET /api/trips/:tripId/stops/:stopId
 */
const getTripStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const userId = req.user.id;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    const stop = await tripStopModel.findById(stopId);
    if (!stop || stop.trip_id !== parseInt(tripId)) {
      return sendError(res, 404, 'Stop not found');
    }

    sendSuccess(res, 200, 'Stop retrieved', {
      stop
    });
  } catch (error) {
    console.error('Get stop error:', error);
    sendError(res, 500, 'Error retrieving stop');
  }
};

/**
 * Create new trip stop
 * POST /api/trips/:tripId/stops
 */
const createTripStop = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const { city, country, startDate, endDate, notes } = req.body;

    // Check authorization
    const trip = await tripModel.findById(tripId, userId);
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
      return sendError(res, 400, 'End date must be after start date');
    }

    // Create stop
    const stop = await tripStopModel.create({
      trip_id: tripId,
      city,
      country,
      start_date: startDate,
      end_date: endDate,
      notes
    });

    sendSuccess(res, 201, 'Stop created successfully', {
      stop
    });
  } catch (error) {
    console.error('Create stop error:', error);
    sendError(res, 500, 'Error creating stop');
  }
};

/**
 * Update trip stop
 * PUT /api/trips/:tripId/stops/:stopId
 */
const updateTripStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const userId = req.user.id;
    const { city, country, startDate, endDate, notes } = req.body;

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

    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
      return sendError(res, 400, 'End date must be after start date');
    }

    // Update stop
    const updatedStop = await tripStopModel.update(stopId, {
      city,
      country,
      start_date: startDate,
      end_date: endDate,
      notes
    });

    sendSuccess(res, 200, 'Stop updated successfully', {
      stop: updatedStop
    });
  } catch (error) {
    console.error('Update stop error:', error);
    sendError(res, 500, 'Error updating stop');
  }
};

/**
 * Delete trip stop
 * DELETE /api/trips/:tripId/stops/:stopId
 */
const deleteTripStop = async (req, res) => {
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

    // Delete stop (activities will be deleted via CASCADE)
    await tripStopModel.deleteStop(stopId);

    sendSuccess(res, 200, 'Stop deleted successfully');
  } catch (error) {
    console.error('Delete stop error:', error);
    sendError(res, 500, 'Error deleting stop');
  }
};

module.exports = {
  getTripStops,
  getTripStop,
  createTripStop,
  updateTripStop,
  deleteTripStop
};