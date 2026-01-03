/**
 * Trip routes
 */

const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateTrip, handleValidationErrors } = require('../middleware/validation.middleware');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * All trip routes are protected
 */
router.use(authenticateToken);

/**
 * GET /api/trips
 * Get all trips for current user
 */
router.get('/', asyncHandler(tripController.getUserTrips));

/**
 * POST /api/trips
 * Create new trip
 */
router.post('/', validateTrip, handleValidationErrors, asyncHandler(tripController.createTrip));

/**
 * GET /api/trips/:tripId
 * Get trip by ID
 */
router.get('/:tripId', asyncHandler(tripController.getTrip));

/**
 * PUT /api/trips/:tripId
 * Update trip
 */
router.put('/:tripId', validateTrip, handleValidationErrors, asyncHandler(tripController.updateTrip));

/**
 * DELETE /api/trips/:tripId
 * Delete trip
 */
router.delete('/:tripId', asyncHandler(tripController.deleteTrip));

module.exports = router;