const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // Use in-memory MongoDB if specified, or if testing
    if (process.env.NODE_ENV === 'test' || process.env.USE_MEMORY_DB === 'true') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();
      console.log(`[Database] Using in-memory MongoDB at ${mongoUri}`);
    }

    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (initialErr) {
      // In development, if local mongod is not installed or running, fallback smoothly to MongoMemoryServer
      if (process.env.NODE_ENV !== 'production' && !memoryServer) {
        console.warn(`[Database] Local MongoDB unreachable (${initialErr.message}). Falling back to MongoMemoryServer for development...`);
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        mongoUri = memoryServer.getUri();
        const conn = await mongoose.connect(mongoUri);
        console.log(`[Database] Connected to fallback in-memory MongoDB: ${conn.connection.host}`);
        return conn;
      }
      throw initialErr;
    }
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (error) {
    console.error(`[Database Error] Disconnection failed: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
