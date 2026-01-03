/**
 * Authentication routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateSignup, validateLogin, handleValidationErrors } = require('../middleware/validation.middleware');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * POST /api/auth/signup
 * Register new user
 */
router.post('/signup', validateSignup, handleValidationErrors, asyncHandler(authController.signup));

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validateLogin, handleValidationErrors, asyncHandler(authController.login));

/**
 * GET /api/auth/me
 * Get current user (protected)
 */
router.get('/me', authenticateToken, asyncHandler(authController.getCurrentUser));

module.exports = router;