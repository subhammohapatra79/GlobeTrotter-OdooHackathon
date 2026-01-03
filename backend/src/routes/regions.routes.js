/**
 * Regions routes
 */

const express = require('express');
const router = express.Router();
const regionsController = require('../controllers/regions.controller');

/**
 * GET /api/regions
 * Get all regions
 */
router.get('/', regionsController.getRegions);

module.exports = router;