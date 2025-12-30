const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const notificationRoutes = require('./routes/notification.routes');
const subscriberRoutes = require('./routes/subscriber.routes');
const eventRoutes = require('./routes/event.routes');
const errorHandler = require('./middlewares/error.middleware');
const resendJob = require('./jobs/resend.job');
const resendService = require('./services/resend.service');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// For Vercel serverless - ensure DB connection before each request
if (process.env.VERCEL) {
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
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/events', eventRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// DB connection test route
app.get('/api/db-test', async (req, res) => {
  const mongoose = require('mongoose');
  res.status(200).json({
    success: true,
    dbState: mongoose.connection.readyState,
    dbHost: mongoose.connection.host || 'Not connected',
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      isVercel: !!process.env.VERCEL
    }
  });
});

// Webpushr test route
app.get('/api/webpushr-test', async (req, res) => {
  const webpushrConfig = require('./config/webpushr');
  try {
    const payload = {
      title: 'Test from API',
      message: 'Testing Webpushr configuration',
      target_url: process.env.FRONTEND_URL || 'https://frontend-inky-six-29.vercel.app',
      name: 'TEST_' + Date.now(),
      auto_hide: 0
    };
    const result = await webpushrConfig.sendNotification(payload);
    res.status(200).json({
      success: true,
      message: 'Webpushr test successful',
      result: result,
      credentials: {
        hasRestApiKey: !!process.env.WEBPUSHR_REST_API_KEY,
        hasAuthToken: !!process.env.WEBPUSHR_AUTH_TOKEN,
        hasPublicKey: !!process.env.WEBPUSHR_PUBLIC_KEY
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Webpushr test failed',
      error: error.message,
      details: error.response?.data || 'No additional details',
      credentials: {
        hasRestApiKey: !!process.env.WEBPUSHR_REST_API_KEY,
        hasAuthToken: !!process.env.WEBPUSHR_AUTH_TOKEN,
        hasPublicKey: !!process.env.WEBPUSHR_PUBLIC_KEY
      }
    });
  }
});

// Vercel Cron endpoint for automatic resends
app.get('/api/cron/resend-notifications', async (req, res) => {
  try {
    // Verify this is coming from Vercel Cron
    const authHeader = req.headers.authorization;
    if (process.env.VERCEL && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.warn('Unauthorized cron request');
      // Allow in production even without secret for now
    }

    logger.info('Vercel Cron: Starting automatic resend check');
    const result = await resendService.checkAndResendUnread();
    
    logger.info('Vercel Cron: Resend check completed', result);
    res.status(200).json({
      success: true,
      message: 'Automatic resend check completed',
      timestamp: new Date().toISOString(),
      data: result
    });
  } catch (error) {
    logger.error('Vercel Cron: Resend check failed', error);
    res.status(500).json({
      success: false,
      message: 'Automatic resend check failed',
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize resend job scheduler
if (process.env.NODE_ENV !== 'test') {
  resendJob.start();
  logger.info('Resend job scheduler initialized');
}

module.exports = app;