const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notification_id: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  type: {
    type: String,
    enum: ['announcement', 'alert', 'info', 'warning'],
    default: 'announcement'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  url: {
    type: String,
    required: true
  },
  readStatus: {
    type: String,
    enum: ['UNREAD', 'READ'],
    default: 'UNREAD'
  },
  send_count: {
    type: Number,
    default: 0
  },
  last_sent_at: {
    type: Date,
    default: null
  },
  max_resend_attempts: {
    type: Number,
    default: 3
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  delivered_count: {
    type: Number,
    default: 0
  },
  read_count: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Auto-generate notification_id before save if not provided
notificationSchema.pre('save', function() {
  if (!this.notification_id) {
    this.notification_id = `N${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
});

module.exports = mongoose.model('Notification', notificationSchema);