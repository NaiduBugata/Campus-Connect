const Notification = require('../models/Notification');
const pushService = require('../services/push.service');
const resendService = require('../services/resend.service');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Public
const getNotifications = async (req, res) => {
  try {
    const { status, readStatus } = req.query;
    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (readStatus && readStatus !== 'all') {
      filter.readStatus = readStatus;
    }

    const notifications = await Notification.find(filter)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create notification and send push
// @route   POST /api/notifications
// @access  Private (Admin)
const createNotification = async (req, res) => {
  try {
    const { title, message, type, priority } = req.body;

    // Generate notification ID
    const notification_id = `N${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Create URL for click tracking
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const url = `${frontendUrl}/notification-read?id=${notification_id}`;

    const notification = await Notification.create({
      notification_id,
      title,
      message,
      type,
      priority,
      url,
      createdBy: req.user.id
    });

    // Send push notification to all subscribers
    try {
      await pushService.sendToAll({
        title,
        message,
        url,
        notification_id
      });
    } catch (pushError) {
      console.error('Push notification error:', pushError);
      // Continue even if push fails
    }

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Public
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await pushService.markAsRead(id);

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get notification by notification_id
// @route   GET /api/notifications/by-id/:notification_id
// @access  Public
const getNotificationById = async (req, res) => {
  try {
    const { notification_id } = req.params;

    const notification = await Notification.findOne({ notification_id })
      .populate('createdBy', 'username');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update notification
// @route   PUT /api/notifications/:id
// @access  Private (Admin)
const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification updated successfully',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private (Admin)
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get notification stats
// @route   GET /api/notifications/stats
// @access  Private (Admin)
const getNotificationStats = async (req, res) => {
  try {
    const total = await Notification.countDocuments();
    const active = await Notification.countDocuments({ status: 'active' });
    const inactive = await Notification.countDocuments({ status: 'inactive' });
    const read = await Notification.countDocuments({ readStatus: 'READ' });
    const unread = await Notification.countDocuments({ readStatus: 'UNREAD' });

    // Get resend stats
    const resendStats = await resendService.getResendStats();

    res.status(200).json({
      success: true,
      stats: {
        total,
        active,
        inactive,
        read,
        unread,
        resend: resendStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Trigger manual resend check
// @route   POST /api/notifications/resend-check
// @access  Private (Admin)
const triggerResendCheck = async (req, res) => {
  try {
    const result = await resendService.checkAndResendUnread();

    res.status(200).json({
      success: true,
      message: 'Resend check completed',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationStats,
  markAsRead,
  getNotificationById,
  triggerResendCheck
};