/**
 * Express application setup
 * Configures middleware, routes, and error handling
 */

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');
const tripStopRoutes = require('./routes/tripStop.routes');
const activityRoutes = require('./routes/activity.routes');
const budgetRoutes = require('./routes/budget.routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

/**
 * Middleware
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'GlobeTrotter API is running' });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trips/:tripId/stops', tripStopRoutes);
app.use('/api/trips/:tripId/stops/:stopId/activities', activityRoutes);
app.use('/api/trips/:tripId/budget', budgetRoutes);

/**
 * 404 handler
 */
app.use(notFoundHandler);

/**
 * Error handler (must be last)
 */
app.use(errorHandler);

module.exports = app;