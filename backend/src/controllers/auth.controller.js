/**
 * Authentication controller
 * Handles user registration and login
 */

const userModel = require('../models/user.model');
const userProfileModel = require('../models/userProfile.model');
const hashUtil = require('../utils/hash.util');
const jwtUtil = require('../utils/jwt.util');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * Register new user
 * POST /api/auth/signup
 */
const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, city, country } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return sendError(res, 409, 'Email already registered');
    }

    // Hash password
    const passwordHash = await hashUtil.hashPassword(password);

    // Create user
    const user = await userModel.create({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName
    });

    // Create user profile with extended info
    try {
      await userProfileModel.create({
        userId: user.id,
        firstName: firstName || null,
        lastName: lastName || null,
        phoneNumber: phone || null,
        city: city || null,
        country: country || null,
        additionalInfo: null
      });
    } catch (profileError) {
      console.error('Error creating user profile:', profileError);
      // Don't fail signup if profile creation fails
    }

    // Generate token
    const token = jwtUtil.generateToken({
      id: user.id,
      email: user.email
    });

    sendSuccess(res, 201, 'User registered successfully', {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      token
    });
    console.log('User created 201');
  } catch (error) {
    console.error('Signup error:', error);
    sendError(res, 500, 'Error registering user');
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await hashUtil.comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Generate token
    const token = jwtUtil.generateToken({
      id: user.id,
      email: user.email
    });

    sendSuccess(res, 200, 'Login successful', {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'Error logging in');
  }
};

/**
 * Get current user
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 200, 'User retrieved', {
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    sendError(res, 500, 'Error getting user');
  }
};

module.exports = {
  signup,
  login,
  getCurrentUser
};