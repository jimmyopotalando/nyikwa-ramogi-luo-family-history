// backend/routes/donation.js

const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

// POST /api/donations - trigger M-Pesa STK push for donations
router.post('/', donationController.initiateDonation);

// POST /api/donations/callback - M-Pesa donation payment confirmation callback
router.post('/callback', donationController.handleDonationCallback);

module.exports = router;
