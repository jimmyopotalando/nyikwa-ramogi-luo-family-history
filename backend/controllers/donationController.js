// backend/controllers/donationController.js

const mpesaService = require('../services/mpesaService');
const donationService = require('../services/donationService');
const logger = require('../utils/logger');

// POST /api/donations
// Initiate a donation payment via M-Pesa STK Push
exports.initiateDonation = async (req, res) => {
  try {
    const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

    if (!phoneNumber || !amount || !accountReference) {
      return res.status(400).json({ error: 'Missing required donation fields' });
    }

    // Initiate M-Pesa STK Push for donation
    const response = await mpesaService.stkPush({
      phoneNumber,
      amount,
      accountReference,
      transactionDesc: transactionDesc || 'Donation to Nyikwa Ramogi Luo family history',
    });

    logger.info(`Donation STK Push initiated: Phone=${phoneNumber}, Amount=${amount}`);

    res.status(200).json({ message: 'Donation STK Push initiated', checkoutRequestID: response.CheckoutRequestID });
  } catch (error) {
    console.error('Error initiating donation payment:', error);
    res.status(500).json({ error: 'Failed to initiate donation payment' });
  }
};

// POST /api/donations/callback
// Handle M-Pesa callback for donation payment confirmation
exports.handleDonationCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    const resultCode = callbackData.Body?.stkCallback?.ResultCode;
    const resultDesc = callbackData.Body?.stkCallback?.ResultDesc;
    const checkoutRequestID = callbackData.Body?.stkCallback?.CheckoutRequestID;
    const callbackMetadata = callbackData.Body?.stkCallback?.CallbackMetadata;

    logger.info(`Received donation callback: CheckoutRequestID=${checkoutRequestID}, ResultCode=${resultCode}`);

    if (resultCode === 0) {
      const items = callbackMetadata?.Item || [];
      const amountItem = items.find(item => item.Name === 'Amount');
      const receiptNumberItem = items.find(item => item.Name === 'MpesaReceiptNumber');
      const phoneNumberItem = items.find(item => item.Name === 'PhoneNumber');

      const amount = amountItem?.Value;
      const receiptNumber = receiptNumberItem?.Value;
      const phoneNumber = phoneNumberItem?.Value;

      // Log donation to donationService (for recording & sending thank you SMS)
      await donationService.logDonation({ phoneNumber, amount, receiptNumber });

      logger.info(`Donation successful: Phone=${phoneNumber}, Amount=${amount}, Receipt=${receiptNumber}`);

      res.status(200).json({ message: 'Donation payment confirmed' });
    } else {
      logger.warn(`Donation payment failed: CheckoutRequestID=${checkoutRequestID}, Reason=${resultDesc}`);
      res.status(200).json({ message: 'Donation payment failed or cancelled' });
    }
  } catch (error) {
    console.error('Error handling donation callback:', error);
    res.status(500).json({ error: 'Failed to handle donation callback' });
  }
};
