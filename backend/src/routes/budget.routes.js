/**
 * Budget routes
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const budgetController = require('../controllers/budget.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * All budget routes are protected
 */
router.use(authenticateToken);

/**
 * GET /api/trips/:tripId/budget
 * Get budget for a trip
 */
router.get('/', budgetController.getTripBudget);

/**
 * POST /api/trips/:tripId/budget/recalculate
 * Recalculate trip budget
 */
router.post('/recalculate', budgetController.recalculateBudget);

module.exports = router;