const dotenv = require('dotenv');

// Load environment variables before anything else
dotenv.config();

const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` Skill Swap Backend Server running on port ${PORT}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(` Environment:  ${process.env.NODE_ENV || 'development'}`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log('\nGracefully shutting down Skill Swap server...');
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      await disconnectDB();
      console.log('Database connection closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

if (require.main === module) {
  startServer();
}

module.exports = { startServer, shutdown };
