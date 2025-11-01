// backend/services/smsService.js

const axios = require('axios');
const smsConfig = require('../config/smsConfig');
const logger = require('../utils/logger');

/**
 * Sends an SMS message using the configured SMS gateway.
 * @param {string} phoneNumber - Recipient's phone number in international format.
 * @param {string} message - Message content.
 * @returns {Promise<Object>} - Result from the SMS gateway.
 */
async function sendSms(phoneNumber, message) {
  try {
    // Example payload format - adapt as per your SMS provider's API requirements
    const payload = {
      to: phoneNumber,
      message: message,
      apiKey: smsConfig.apiKey,          // or use auth headers depending on provider
      senderId: smsConfig.senderId,      // optional
    };

    const response = await axios.post(smsConfig.apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if required by your SMS provider
        Authorization: `Bearer ${smsConfig.apiToken}`,
      },
    });

    if (response.data.success || response.status === 200) {
      logger.info(`SMS sent to ${phoneNumber}: "${message}"`);
      return response.data;
    } else {
      logger.error(`Failed to send SMS to ${phoneNumber}: ${JSON.stringify(response.data)}`);
      throw new Error('SMS sending failed');
    }
  } catch (error) {
    logger.error(`Error sending SMS to ${phoneNumber}: ${error.message}`);
    throw error;
  }
}

module.exports = {
  sendSms,
};
