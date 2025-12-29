const express = require('express');
const router = express.Router();
const { login, createAdmin } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/create-admin', createAdmin);

module.exports = router;