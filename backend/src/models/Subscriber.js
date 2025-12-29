const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  subscriber_id: {
    type: String,
    required: [true, 'Subscriber ID is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    sparse: true // Allow null values
  },
  device_token: {
    type: String,
    default: null
  },
  device_type: {
    type: String,
    enum: ['web', 'android', 'ios'],
    default: 'web'
  },
  browser: {
    type: String,
    default: null
  },
  os: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  lastNotificationAt: {
    type: Date,
    default: null
  },
  totalNotificationsReceived: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscriber', subscriberSchema);