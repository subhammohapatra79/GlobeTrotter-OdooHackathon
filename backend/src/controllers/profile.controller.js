/**
 * Profile controller
 * Handles user profile operations
 */

const userProfileModel = require('../models/userProfile.model');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * Get user profile
 * GET /api/profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await userProfileModel.findByUserId(userId);

    if (!profile) {
      return sendError(res, 404, 'Profile not found');
    }

    sendSuccess(res, 200, 'Profile retrieved successfully', {
      profile: {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phoneNumber: profile.phone_number,
        city: profile.city,
        country: profile.country,
        additionalInfo: profile.additional_info,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 500, 'Internal server error');
  }
};

/**
 * Create user profile
 * POST /api/profile
 */
const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phoneNumber, city, country, additionalInfo } = req.body;

    // Check if profile already exists
    const existingProfile = await userProfileModel.findByUserId(userId);
    if (existingProfile) {
      return sendError(res, 409, 'Profile already exists');
    }

    const profile = await userProfileModel.create({
      userId,
      firstName,
      lastName,
      phoneNumber,
      city,
      country,
      additionalInfo
    });

    sendSuccess(res, 201, 'Profile created successfully', {
      profile: {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phoneNumber: profile.phone_number,
        city: profile.city,
        country: profile.country,
        additionalInfo: profile.additional_info,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    });
  } catch (error) {
    console.error('Create profile error:', error);
    sendError(res, 500, 'Internal server error');
  }
};

/**
 * Update user profile
 * PUT /api/profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phoneNumber, city, country, additionalInfo } = req.body;

    const profile = await userProfileModel.update(userId, {
      firstName,
      lastName,
      phoneNumber,
      city,
      country,
      additionalInfo
    });

    if (!profile) {
      return sendError(res, 404, 'Profile not found');
    }

    sendSuccess(res, 200, 'Profile updated successfully', {
      profile: {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phoneNumber: profile.phone_number,
        city: profile.city,
        country: profile.country,
        additionalInfo: profile.additional_info,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 500, 'Internal server error');
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile
};