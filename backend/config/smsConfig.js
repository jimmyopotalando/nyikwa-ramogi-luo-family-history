// config/smsConfig.js

/**
 * SMS Configuration Module
 * Supports Africa's Talking and Twilio (extendable)
 */

const dotenv = require("dotenv");
dotenv.config();

const provider = process.env.SMS_PROVIDER || "africastalking"; // "twilio" also supported

const config = {
  provider,

  africastalking: {
    username: process.env.AT_USERNAME || "",
    apiKey: process.env.AT_API_KEY || "",
    senderId: process.env.AT_SENDER_ID || "NyikwaRamogi" // Optional: Branded sender
  },

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    senderNumber: process.env.TWILIO_SENDER_NUMBER || "" // e.g., +1234567890
  },

  fallbackMessage:
    "Nyikwa Ramogi: Thank you. Your request has been received. Visit again for more history!"
};

module.exports = config;
