require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// For Vercel serverless, export app with lazy DB connection
if (process.env.VERCEL) {
  // Middleware to ensure DB connection before each request
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      console.error('DB connection error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Database connection failed' 
      });
    }
  });
  
  module.exports = app;
} else {
  // For local development, connect once on startup
  connectDB();

  // Start server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`❌ Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
  
  module.exports = server;
}