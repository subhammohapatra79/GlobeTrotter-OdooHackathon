/**
 * Authentication routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateSignup, validateLogin, handleValidationErrors } = require('../middleware/validation.middleware');

/**
 * POST /api/auth/signup
 * Register new user
 */
router.post('/signup', validateSignup, handleValidationErrors, authController.signup);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validateLogin, handleValidationErrors, authController.login);

/**
 * GET /api/auth/me
 * Get current user (protected)
 */
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;