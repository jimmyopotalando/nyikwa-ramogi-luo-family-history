// backend/controllers/paymentController.js

const mpesaService = require('../services/mpesaService');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// POST /api/payments
// Initiates STK push for clan access or donation payment
exports.initiatePayment = async (req, res) => {
  try {
    const { phoneNumber, amount, accountReference, transactionDesc, paymentType, clanName, countyName } = req.body;

    if (!phoneNumber || !amount || !accountReference || !paymentType) {
      return res.status(400).json({ error: 'Missing required payment fields' });
    }

    // Initiate M-Pesa STK Push via service
    const response = await mpesaService.stkPush({
      phoneNumber,
      amount,
      accountReference,
      transactionDesc: transactionDesc || '',
    });

    // Log payment initiation
    logger.info(`Initiated ${paymentType} payment: ${phoneNumber} - ${amount} - ${accountReference}`);

    // Save initial payment info to log file (optional)

    res.status(200).json({ message: 'STK Push initiated', checkoutRequestID: response.CheckoutRequestID });
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};

// POST /api/payments/callback
// Handles M-Pesa payment confirmation callback
exports.handlePaymentCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    // Extract relevant details from M-Pesa callback
    const resultCode = callbackData.Body?.stkCallback?.ResultCode;
    const resultDesc = callbackData.Body?.stkCallback?.ResultDesc;
    const checkoutRequestID = callbackData.Body?.stkCallback?.CheckoutRequestID;
    const callbackMetadata = callbackData.Body?.stkCallback?.CallbackMetadata;

    // Log callback receipt
    logger.info(`Received M-Pesa callback: CheckoutRequestID=${checkoutRequestID}, ResultCode=${resultCode}`);

    if (resultCode === 0) {
      // Payment successful
      // Extract amount and phone from callback metadata
      const items = callbackMetadata?.Item || [];
      const amountItem = items.find(item => item.Name === 'Amount');
      const mpesaReceiptNumberItem = items.find(item => item.Name === 'MpesaReceiptNumber');
      const phoneNumberItem = items.find(item => item.Name === 'PhoneNumber');

      const amount = amountItem?.Value;
      const receiptNumber = mpesaReceiptNumberItem?.Value;
      const phoneNumber = phoneNumberItem?.Value;

      // Determine if payment is for clan access or donation by checking logs or DB (not shown here)
      // For simplicity, assume clan access if accountReference includes clan name, otherwise donation

      // Here, you would lookup payment info using checkoutRequestID from a database or cache to determine context.
      // For demo, just log success and respond.

      logger.info(`Payment Success: Phone=${phoneNumber}, Amount=${amount}, Receipt=${receiptNumber}`);

      // TODO:
      // 1. If clan access payment:
      //    - Read clan data JSON (based on county/clan saved in DB/cache)
      //    - Format clan info SMS message
      //    - Send SMS via SMS gateway
      // 2. If donation payment:
      //    - Log donation to donation log
      //    - Send thank you SMS

      // For now, just acknowledge receipt
      res.status(200).json({ message: 'Payment confirmed' });
    } else {
      // Payment failed or cancelled
      logger.warn(`Payment Failed: CheckoutRequestID=${checkoutRequestID}, Reason=${resultDesc}`);
      res.status(200).json({ message: 'Payment failed or cancelled' });
    }
  } catch (error) {
    console.error('Error handling payment callback:', error);
    res.status(500).json({ error: 'Failed to handle payment callback' });
  }
};
