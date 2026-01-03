/**
 * Dashboard routes
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * All dashboard routes are protected
 */
router.use(authenticateToken);

/**
 * GET /api/dashboard
 * Get dashboard summary
 */
router.get('/', dashboardController.getDashboardSummary);

module.exports = router;