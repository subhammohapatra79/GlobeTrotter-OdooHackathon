/**
 * Trip routes
 */

const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateTrip, handleValidationErrors } = require('../middleware/validation.middleware');

/**
 * All trip routes are protected
 */
router.use(authenticateToken);

/**
 * GET /api/trips
 * Get all trips for current user
 */
router.get('/', tripController.getUserTrips);

/**
 * POST /api/trips
 * Create new trip
 */
router.post('/', validateTrip, handleValidationErrors, tripController.createTrip);

/**
 * GET /api/trips/:tripId
 * Get trip by ID
 */
router.get('/:tripId', tripController.getTrip);

/**
 * PUT /api/trips/:tripId
 * Update trip
 */
router.put('/:tripId', validateTrip, handleValidationErrors, tripController.updateTrip);

/**
 * DELETE /api/trips/:tripId
 * Delete trip
 */
router.delete('/:tripId', tripController.deleteTrip);

module.exports = router;