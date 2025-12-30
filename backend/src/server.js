require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// For Vercel serverless, just export app (DB connection is handled in app.js)
if (process.env.VERCEL) {
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