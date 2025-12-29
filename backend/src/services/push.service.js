const webpushrConfig = require('../config/webpushr');
const Notification = require('../models/Notification');
const Subscriber = require('../models/Subscriber');
const logger = require('../utils/logger');

class PushService {
  /**
   * Send push notification to all active subscribers
   */
  async sendToAll(notificationData) {
    try {
      const { title, message, url, notification_id } = notificationData;

      // Prepare Webpushr payload
      const payload = {
        title: title,
        message: message,
        target_url: url,
        name: notification_id,
        auto_hide: 0, // Don't auto-hide
        send_at: 'now',
        action_buttons: [
          {
            title: 'View Details',
            url: url
          }
        ]
      };

      // Send via Webpushr
      const response = await webpushrConfig.sendNotification(payload);

      logger.info(`Push notification sent: ${notification_id}`, response);

      // Update notification in database
      await Notification.findOneAndUpdate(
        { notification_id },
        {
          $inc: { send_count: 1 },
          last_sent_at: new Date()
        }
      );

      return {
        success: true,
        message: 'Notification sent successfully',
        webpushr_response: response
      };
    } catch (error) {
      logger.error('Error sending push notification:', error);
      throw error;
    }
  }

  /**
   * Send push notification to specific subscriber
   */
  async sendToSubscriber(subscriberId, notificationData) {
    try {
      const { title, message, url, notification_id } = notificationData;

      // Check if subscriber exists and is active
      const subscriber = await Subscriber.findOne({
        subscriber_id: subscriberId,
        isActive: true
      });

      if (!subscriber) {
        throw new Error('Subscriber not found or inactive');
      }

      // Prepare Webpushr payload
      const payload = {
        title: title,
        message: message,
        target_url: url,
        name: notification_id,
        auto_hide: 0,
        send_at: 'now',
        action_buttons: [
          {
            title: 'View Details',
            url: url
          }
        ]
      };

      // Send via Webpushr
      const response = await webpushrConfig.sendToSubscriber(subscriberId, payload);

      logger.info(`Push notification sent to ${subscriberId}: ${notification_id}`);

      // Update subscriber stats
      await Subscriber.findOneAndUpdate(
        { subscriber_id: subscriberId },
        {
          lastNotificationAt: new Date(),
          $inc: { totalNotificationsReceived: 1 }
        }
      );

      return {
        success: true,
        message: 'Notification sent to subscriber',
        webpushr_response: response
      };
    } catch (error) {
      logger.error('Error sending push notification to subscriber:', error);
      throw error;
    }
  }

  /**
   * Get delivery statistics for a notification
   */
  async getDeliveryStats(notificationId) {
    try {
      const response = await webpushrConfig.getNotificationStatus(notificationId);
      return response;
    } catch (error) {
      logger.error('Error getting delivery stats:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notification_id) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { notification_id },
        {
          readStatus: 'READ',
          $inc: { read_count: 1 }
        },
        { new: true }
      );

      if (!notification) {
        throw new Error('Notification not found');
      }

      logger.info(`Notification marked as read: ${notification_id}`);
      return notification;
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  }
}

module.exports = new PushService();
