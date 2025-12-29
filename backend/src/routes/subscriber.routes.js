const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getSubscribers
} = require('../controllers/subscriber.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', subscribe);
router.delete('/:email', unsubscribe);
router.get('/', protect, getSubscribers);

module.exports = router;