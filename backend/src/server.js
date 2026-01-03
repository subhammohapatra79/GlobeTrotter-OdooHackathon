/**
 * Server entry point
 * Initializes database and starts the Express server
 */

const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');
const userModel = require('./models/user.model');
const tripModel = require('./models/trip.model');
const tripStopModel = require('./models/tripStop.model');
const activityModel = require('./models/activity.model');
const budgetModel = require('./models/budget.model');

/**
 * Initialize database tables
 */
const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    await userModel.createTable();
    await tripModel.createTable();
    await tripStopModel.createTable();
    await activityModel.createTable();
    await budgetModel.createTable();
    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('✗ Failed to initialize database:', error);
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
      console.log(`\n🌍 GlobeTrotter API running on http://localhost:${PORT}`);
      console.log(`📝 Try: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();