// backend/services/donationService.js

const fs = require('fs');
const path = require('path');
const smsService = require('./smsService');
const logger = require('../utils/logger');

const donationLogPath = path.join(__dirname, '../../logs/donation.log');

/**
 * Logs a donation to the donation log file.
 * @param {Object} donationData - Donation details (e.g., phone, amount, clan).
 */
function logDonation(donationData) {
  const logEntry = `${new Date().toISOString()} - Donation: ${JSON.stringify(donationData)}\n`;
  fs.appendFile(donationLogPath, logEntry, (err) => {
    if (err) {
      logger.error('Failed to log donation:', err);
    } else {
      logger.info('Donation logged:', donationData);
    }
  });
}

/**
 * Sends a donation receipt SMS to the donor.
 * @param {string} phoneNumber - Donor's phone number.
 * @param {number} amount - Donation amount.
 */
async function sendDonationReceiptSms(phoneNumber, amount) {
  const message = `Thank you for your generous donation of KES ${amount}. Your support helps preserve Nyikwa Ramogi Luo family history.`;
  try {
    await smsService.sendSms(phoneNumber, message);
    logger.info(`Donation receipt SMS sent to ${phoneNumber}`);
  } catch (error) {
    logger.error(`Failed to send donation receipt SMS to ${phoneNumber}: ${error.message}`);
  }
}

/**
 * Handles the full donation flow: log donation and send receipt SMS.
 * @param {Object} donationData - Donation details including phone, amount, clan, etc.
 */
async function handleDonation(donationData) {
  logDonation(donationData);
  await sendDonationReceiptSms(donationData.phone, donationData.amount);
}

module.exports = {
  logDonation,
  sendDonationReceiptSms,
  handleDonation,
};
