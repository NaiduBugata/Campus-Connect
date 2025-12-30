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

router.get('/', protect, getNotifications);
router.get('/stats', protect, getNotificationStats);
router.get('/by-id/:notification_id', protect, getNotificationById);
router.post('/', protect, createNotification);
router.post('/resend-check', protect, triggerResendCheck);
router.put('/:id', protect, updateNotification);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;