const mongoose = require('mongoose');

// Cache the MongoDB connection for serverless
let cachedConnection = null;

const connectDB = async () => {
  // If already connected in serverless, reuse the connection
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 60000, // Increased to 60s for cold starts
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      maxPoolSize: 1, // Limit pool size for serverless
      minPoolSize: 0,
    });

    cachedConnection = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    console.error('Full error:', error);
    throw error;
  }
};

module.exports = connectDB;