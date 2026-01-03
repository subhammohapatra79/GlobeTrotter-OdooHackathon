/**
 * Error handling middleware
 * Catches and formats errors
 */

const { sendError } = require('../utils/response.util');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle database errors
  if (err.code && err.code.startsWith('23')) {
    return sendError(res, 409, 'Database constraint violated', {
      detail: err.detail
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return sendError(res, 422, 'Validation failed', err.message);
  }

  // Handle authentication errors
  if (err.name === 'UnauthorizedError') {
    return sendError(res, 401, 'Unauthorized', err.message);
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  sendError(res, statusCode, message);
};

/**
 * 404 handler middleware
 */
const notFoundHandler = (req, res) => {
  sendError(res, 404, 'Route not found');
};

module.exports = {
  errorHandler,
  notFoundHandler
};