/**
 * Regions controller
 * Handles region-related operations
 */

const { sendSuccess } = require('../utils/response.util');

/**
 * Get all regions
 * GET /api/regions
 */
const getRegions = async (req, res) => {
  // Static regions data matching frontend
  const regions = [
    { id: 1, name: 'Europe', img: '/images/europe.png' },
    { id: 2, name: 'Asia', img: '/images/asia.png' },
    { id: 3, name: 'Africa', img: '/images/africa.png' },
    { id: 4, name: 'N. America', img: '/images/namerica.png' },
    { id: 5, name: 'S. America', img: '/images/samerica.png' },
    { id: 6, name: 'Antarctica', img: '/images/antarctica.png' },
    { id: 7, name: 'Australia', img: '/images/australia.png' }
  ];

  sendSuccess(res, 200, 'Regions retrieved', {
    regions
  });
};

module.exports = {
  getRegions
};