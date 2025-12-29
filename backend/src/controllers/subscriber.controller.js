const Subscriber = require('../models/Subscriber');

// @desc    Subscribe to notifications with Webpushr subscriber ID
// @route   POST /api/subscribers
// @access  Public
const subscribe = async (req, res) => {
  try {
    const { subscriber_id, email, device_token, device_type, browser, os } = req.body;

    if (!subscriber_id) {
      return res.status(400).json({
        success: false,
        message: 'Subscriber ID is required'
      });
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ subscriber_id });
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(200).json({
          success: true,
          message: 'Already subscribed',
          data: existingSubscriber
        });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.email = email || existingSubscriber.email;
        existingSubscriber.device_token = device_token || existingSubscriber.device_token;
        existingSubscriber.device_type = device_type || existingSubscriber.device_type;
        existingSubscriber.browser = browser || existingSubscriber.browser;
        existingSubscriber.os = os || existingSubscriber.os;
        await existingSubscriber.save();
        
        return res.status(200).json({
          success: true,
          message: 'Subscription reactivated successfully',
          data: existingSubscriber
        });
      }
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({
      subscriber_id,
      email,
      device_token,
      device_type,
      browser,
      os
    });

    res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
      data: subscriber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Unsubscribe from notifications
// @route   DELETE /api/subscribers/:subscriber_id
// @access  Public
const unsubscribe = async (req, res) => {
  try {
    const { subscriber_id } = req.params;

    const subscriber = await Subscriber.findOne({ subscriber_id });
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'Unsubscribed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private (Admin)
const getSubscribers = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const subscribers = await Subscriber.find(filter)
      .sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get subscriber stats
// @route   GET /api/subscribers/stats
// @access  Private (Admin)
const getSubscriberStats = async (req, res) => {
  try {
    const total = await Subscriber.countDocuments();
    const active = await Subscriber.countDocuments({ isActive: true });
    const inactive = await Subscriber.countDocuments({ isActive: false });

    res.status(200).json({
      success: true,
      stats: {
        total,
        active,
        inactive
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

module.exports = {
  subscribe,
  unsubscribe,
  getSubscribers,
  getSubscriberStats
};