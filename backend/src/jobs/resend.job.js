const cron = require('node-cron');
const resendService = require('../services/resend.service');
const logger = require('../utils/logger');

class ResendJob {
  constructor() {
    this.job = null;
  }

  /**
   * Start the resend job scheduler
   * Runs every 15 minutes to check for unread notifications
   */
  start() {
    // Run every 15 minutes
    this.job = cron.schedule('*/15 * * * *', async () => {
      logger.info('Running resend job...');
      
      try {
        const result = await resendService.checkAndResendUnread();
        logger.info('Resend job completed:', result);
      } catch (error) {
        logger.error('Resend job failed:', error);
      }
    });

    logger.info('Resend job scheduler started (runs every 15 minutes)');
  }

  /**
   * Stop the resend job scheduler
   */
  stop() {
    if (this.job) {
      this.job.stop();
      logger.info('Resend job scheduler stopped');
    }
  }

  /**
   * Run the resend job immediately (for testing)
   */
  async runNow() {
    logger.info('Running resend job manually...');
    
    try {
      const result = await resendService.checkAndResendUnread();
      logger.info('Manual resend job completed:', result);
      return result;
    } catch (error) {
      logger.error('Manual resend job failed:', error);
      throw error;
    }
  }
}

module.exports = new ResendJob();
