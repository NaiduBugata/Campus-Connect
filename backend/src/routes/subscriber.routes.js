const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getSubscribers,
  getSubscriberStats
} = require('../controllers/subscriber.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', subscribe);
router.delete('/:subscriber_id', unsubscribe);
router.get('/', protect, getSubscribers);
router.get('/stats', protect, getSubscriberStats);

module.exports = router;