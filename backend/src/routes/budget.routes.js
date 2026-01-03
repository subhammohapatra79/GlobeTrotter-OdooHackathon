/**
 * Budget routes
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const budgetController = require('../controllers/budget.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * All budget routes are protected
 */
router.use(authenticateToken);

/**
 * GET /api/trips/:tripId/budget
 * Get budget for a trip
 */
router.get('/', asyncHandler(budgetController.getTripBudget));

/**
 * POST /api/trips/:tripId/budget
 * Create or update budget for a trip
 */
router.post('/', asyncHandler(budgetController.updateBudget));

/**
 * PUT /api/trips/:tripId/budget
 * Update budget for a trip
 */
router.put('/', asyncHandler(budgetController.updateBudget));

/**
 * POST /api/trips/:tripId/budget/recalculate
 * Recalculate trip budget
 */
router.post('/recalculate', asyncHandler(budgetController.recalculateBudget));

module.exports = router;