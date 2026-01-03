/**
 * JWT token utilities
 * Handles creation and verification of JWT tokens
 */

const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generate JWT token
 * @param {object} payload - Token payload
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  try {
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn
    });
  } catch (error) {
    throw new Error('Error generating token: ' + error.message);
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error('Error verifying token: ' + error.message);
  }
};

module.exports = {
  generateToken,
  verifyToken
};