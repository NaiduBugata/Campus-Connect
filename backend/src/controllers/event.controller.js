const Event = require('../models/Event');
const Notification = require('../models/Notification');
const pushService = require('../services/push.service');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};

    const events = await Event.find(filter)
      .populate('createdBy', 'username')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Admin)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category, status } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      status,
      createdBy: req.user.id
    });

    // Create notification for the event
    const notification_id = `N${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const url = `${frontendUrl}/notification-read?id=${notification_id}`;

    const notificationTitle = `📅 New Event: ${title}`;
    const notificationMessage = `${description}\n📍 ${location}\n🕒 ${date} at ${time}`;

    // Save notification to database
    const notification = await Notification.create({
      notification_id,
      title: notificationTitle,
      message: notificationMessage,
      type: 'announcement',
      priority: category === 'career' ? 'high' : 'normal',
      url,
      createdBy: req.user.id
    });

    // Send push notification to all subscribers
    try {
      await pushService.sendToAll({
        title: notificationTitle,
        message: notificationMessage,
        url,
        notification_id
      });
    } catch (pushError) {
      console.error('Push notification error for event:', pushError);
      // Continue even if push fails
    }

    res.status(201).json({
      success: true,
      message: 'Event created successfully and notification sent',
      data: event,
      notification: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
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
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
