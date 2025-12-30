const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/event.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public route (students can view events)
router.get('/', getEvents);

// Protected routes (admin only)
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
