/**
 * Cities controller
 * Handles city-related operations
 */

const { sendSuccess } = require('../utils/response.util');

/**
 * Get popular cities
 * GET /api/cities/popular
 */
const getPopularCities = async (req, res) => {
  // Static popular cities for demo
  const popularCities = [
    { id: 1, name: 'Paris', country: 'France', costIndex: 'High', popularity: 95 },
    { id: 2, name: 'Tokyo', country: 'Japan', costIndex: 'High', popularity: 92 },
    { id: 3, name: 'New York', country: 'USA', costIndex: 'High', popularity: 90 },
    { id: 4, name: 'Bali', country: 'Indonesia', costIndex: 'Medium', popularity: 88 },
    { id: 5, name: 'London', country: 'UK', costIndex: 'High', popularity: 85 },
    { id: 6, name: 'Barcelona', country: 'Spain', costIndex: 'Medium', popularity: 82 }
  ];

  sendSuccess(res, 200, 'Popular cities retrieved', {
    cities: popularCities
  });
};

module.exports = {
  getPopularCities
};