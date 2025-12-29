const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const notificationRoutes = require('./routes/notification.routes');
const subscriberRoutes = require('./routes/subscriber.routes');
const eventRoutes = require('./routes/event.routes');
const errorHandler = require('./middlewares/error.middleware');
const resendJob = require('./jobs/resend.job');
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