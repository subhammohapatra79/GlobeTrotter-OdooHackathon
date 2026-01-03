/**
 * Trip Stop routes
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const tripStopController = require('../controllers/tripStop.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateTripStop, handleValidationErrors } = require('../middleware/validation.middleware');

/**
 * All trip stop routes are protected
 */
router.use(authenticateToken);

/**
 * GET /api/trips/:tripId/stops
 * Get all stops for a trip
 */
router.get('/', tripStopController.getTripStops);

/**
 * POST /api/trips/:tripId/stops
 * Create new trip stop
 */
router.post('/', validateTripStop, handleValidationErrors, tripStopController.createTripStop);

/**
 * GET /api/trips/:tripId/stops/:stopId
 * Get trip stop by ID
 */
router.get('/:stopId', tripStopController.getTripStop);

/**
 * PUT /api/trips/:tripId/stops/:stopId
 * Update trip stop
 */
router.put('/:stopId', validateTripStop, handleValidationErrors, tripStopController.updateTripStop);

/**
 * DELETE /api/trips/:tripId/stops/:stopId
 * Delete trip stop
 */
router.delete('/:stopId', tripStopController.deleteTripStop);

module.exports = router;