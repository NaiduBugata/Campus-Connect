const Notification = require('../models/Notification');
const pushService = require('./push.service');
const logger = require('../utils/logger');

class ResendService {
  /**
   * Check and resend unread notifications
   */
  async checkAndResendUnread() {
    try {
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

      // Find unread notifications that need resending
      const notificationsToResend = await Notification.find({
        readStatus: 'UNREAD',
        status: 'active',
        $or: [
          // First resend after 30 minutes
          {
            send_count: 1,
            last_sent_at: { $lte: thirtyMinutesAgo }
          },
          // Second resend after 6 hours
          {
            send_count: 2,
            last_sent_at: { $lte: sixHoursAgo }
          }
        ]
      }).where('send_count').lt(3);

      logger.info(`Found ${notificationsToResend.length} notifications to resend`);

      const results = [];

      for (const notification of notificationsToResend) {
        try {
          // Check if we haven't exceeded max attempts
          if (notification.send_count >= notification.max_resend_attempts) {
            logger.info(`Max resend attempts reached for ${notification.notification_id}`);
            continue;
          }

          // Prepare notification data for resending
          const notificationData = {
            title: `🔔 Reminder: ${notification.title}`,
            message: notification.message,
            url: notification.url,
            notification_id: notification.notification_id
          };

          // Resend notification
          const result = await pushService.sendToAll(notificationData);

          results.push({
            notification_id: notification.notification_id,
            success: true,
            send_count: notification.send_count + 1
          });

          logger.info(`Resent notification: ${notification.notification_id} (Attempt ${notification.send_count + 1})`);
        } catch (error) {
          logger.error(`Error resending notification ${notification.notification_id}:`, error);
          results.push({
            notification_id: notification.notification_id,
            success: false,
            error: error.message
          });
        }
      }

      return {
        total_checked: notificationsToResend.length,
        results: results
      };
    } catch (error) {
      logger.error('Error in checkAndResendUnread:', error);
      throw error;
    }
  }

  /**
   * Get resend statistics
   */
  async getResendStats() {
    try {
      const stats = await Notification.aggregate([
        {
          $group: {
            _id: '$readStatus',
            count: { $sum: 1 },
            avgSendCount: { $avg: '$send_count' }
          }
        }
      ]);

      const pendingResends = await Notification.countDocuments({
        readStatus: 'UNREAD',
        send_count: { $lt: 3 },
        status: 'active'
      });

      return {
        stats,
        pendingResends
      };
    } catch (error) {
      logger.error('Error getting resend stats:', error);
      throw error;
    }
  }

  /**
   * Stop resending a specific notification
   */
  async stopResending(notification_id) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { notification_id },
        { status: 'inactive' },
        { new: true }
      );

      if (!notification) {
        throw new Error('Notification not found');
      }

      logger.info(`Stopped resending for notification: ${notification_id}`);
      return notification;
    } catch (error) {
      logger.error('Error stopping resend:', error);
      throw error;
    }
  }
}

module.exports = new ResendService();
