/**
 * Validation middleware
 * Validates user input before processing
 */

const { validationResult, body } = require('express-validator');
const { sendError } = require('../utils/response.util');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach(error => {
      formattedErrors[error.param] = error.msg;
    });
    console.error('Validation errors:', formattedErrors);  // Added error logging
    return sendError(res, 422, 'Validation failed', formattedErrors);
  }
  next();
};

/**
 * Validators for authentication
 */
const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Invalid email format');

const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters');

const validateSignup = [
  validateEmail,
  validatePassword,
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
];

const validateLogin = [
  validateEmail,
  body('password').notEmpty().withMessage('Password is required')
];

/**
 * Validators for trips
 */
const validateTrip = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Trip name is required'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('description')
    .trim()
    .optional()
];

/**
 * Validators for trip stops
 */
const validateTripStop = [
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('country')
    .trim()
    .optional(),
  body('notes')
    .trim()
    .optional()
];

/**
 * Validators for activities
 */
const validateActivity = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Activity name is required'),
  body('cost')
    .isFloat({ min: 0 })
    .withMessage('Cost must be a non-negative number'),
  body('durationHours')
    .isFloat({ min: 0 })
    .withMessage('Duration must be a non-negative number'),
  body('description')
    .trim()
    .optional(),
  body('category')
    .trim()
    .optional()
];

/**
 * Validators for profile
 */
const validateProfile = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('phoneNumber')
    .trim()
    .optional(),
  body('city')
    .trim()
    .optional(),
  body('country')
    .trim()
    .optional(),
  body('additionalInfo')
    .trim()
    .optional()
];

module.exports = {
  handleValidationErrors,
  validateSignup,
  validateLogin,
  validateTrip,
  validateTripStop,
  validateActivity,
  validateProfile
};