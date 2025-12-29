const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationStats
} = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', getNotifications);
router.get('/stats', protect, getNotificationStats);
router.post('/', protect, createNotification);
router.put('/:id', protect, updateNotification);
router.delete('/:id', protect, deleteNotification);

module.exports = router;