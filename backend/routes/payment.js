// backend/routes/payment.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST /api/payments - triggers M-Pesa STK push for clan access or donation
router.post('/', paymentController.initiatePayment);

// POST /api/payments/callback - M-Pesa payment confirmation callback
router.post('/callback', paymentController.handlePaymentCallback);

module.exports = router;
