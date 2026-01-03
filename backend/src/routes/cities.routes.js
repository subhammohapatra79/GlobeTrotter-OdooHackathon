/**
 * Cities routes
 */

const express = require('express');
const router = express.Router();
const citiesController = require('../controllers/cities.controller');

/**
 * GET /api/cities/popular
 * Get popular cities
 */
router.get('/popular', citiesController.getPopularCities);

module.exports = router;