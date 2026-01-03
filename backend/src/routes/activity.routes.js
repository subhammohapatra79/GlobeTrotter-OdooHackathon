/**
 * Activity routes
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const activityController = require('../controllers/activity.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateActivity, handleValidationErrors } = require('../middleware/validation.middleware');

/**
 * All activity routes are protected
 */
router.use(authenticateToken);

/**
 * GET /api/trips/:tripId/stops/:stopId/activities
 * Get all activities for a stop
 */
router.get('/', activityController.getActivities);

/**
 * POST /api/trips/:tripId/stops/:stopId/activities
 * Create new activity
 */
router.post('/', validateActivity, handleValidationErrors, activityController.createActivity);

/**
 * GET /api/trips/:tripId/stops/:stopId/activities/:activityId
 * Get activity by ID
 */
router.get('/:activityId', activityController.getActivity);

/**
 * PUT /api/trips/:tripId/stops/:stopId/activities/:activityId
 * Update activity
 */
router.put('/:activityId', validateActivity, handleValidationErrors, activityController.updateActivity);

/**
 * DELETE /api/trips/:tripId/stops/:stopId/activities/:activityId
 * Delete activity
 */
router.delete('/:activityId', activityController.deleteActivity);

module.exports = router;