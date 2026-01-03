/**
 * Authentication middleware
 * Verifies JWT tokens and protects routes
 */

const jwtUtil = require('../utils/jwt.util');
const { sendError } = require('../utils/response.util');

/**
 * Middleware to verify JWT token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer token"

  if (!token) {
    return sendError(res, 401, 'Access token required');
  }

  try {
    const decoded = jwtUtil.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 403, error.message);
  }
};

module.exports = {
  authenticateToken
};