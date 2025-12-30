const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationStats,
  markAsRead,
  getNotificationById,
  triggerResendCheck
} = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public routes (students can access)
router.get('/', getNotifications);
router.get('/by-id/:notification_id', getNotificationById);
router.put('/:id/read', markAsRead);

// Protected routes (admin only)
router.get('/stats', protect, getNotificationStats);
router.post('/', protect, createNotification);
router.post('/resend-check', protect, triggerResendCheck);
router.put('/:id', protect, updateNotification);
router.delete('/:id', protect, deleteNotification);

module.exports = router;