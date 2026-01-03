/**
 * Profile routes
 * Protected routes for user profile management
 */

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateProfile, handleValidationErrors } = require('../middleware/validation.middleware');

/**
 * GET /api/profile
 * Get current user's profile
 */
router.get('/', authenticateToken, profileController.getProfile);

/**
 * POST /api/profile
 * Create user profile
 */
router.post('/', authenticateToken, validateProfile, handleValidationErrors, profileController.createProfile);

/**
 * PUT /api/profile
 * Update user profile
 */
router.put('/', authenticateToken, validateProfile, handleValidationErrors, profileController.updateProfile);

module.exports = router;