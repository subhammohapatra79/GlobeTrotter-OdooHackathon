/**
 * Server entry point
 * Initializes database and starts the Express server
 */

const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');
const userModel = require('./models/user.model');
const userProfileModel = require('./models/userProfile.model');
const tripModel = require('./models/trip.model');
const tripStopModel = require('./models/tripStop.model');
const activityModel = require('./models/activity.model');
const budgetModel = require('./models/budget.model');

/**
 * Initialize database tables
 */
const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');  // Changed to plain text
    await userModel.createTable();
    await userProfileModel.createTable();
    await tripModel.createTable();
    await tripStopModel.createTable();
    await activityModel.createTable();
    await budgetModel.createTable();
    console.log('Database initialized successfully');  // Changed to plain text
  } catch (error) {
    console.error('Failed to initialize database:', error);  // Changed to plain text
    process.exit(1);
  }
};

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Initialize database first
    await initializeDatabase();

    // Start Express server
    const PORT = env.server.port;
    app.listen(PORT, () => {
      console.log(`GlobeTrotter API running on http://localhost:${PORT}`);  // Changed to plain text
      console.log(`Try: http://localhost:${PORT}/health`);  // Changed to plain text
    });
  } catch (error) {
    console.error('Failed to start server:', error);  // Changed to plain text
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();