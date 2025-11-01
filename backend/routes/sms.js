// backend/routes/sms.js

const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

// POST /api/sms - send an SMS message
router.post('/', smsController.sendSms);

module.exports = router;
