// config/env.js

/**
 * Environment Configuration Loader
 * Central access to environment variables across app
 */

require("dotenv").config();

const requiredVars = [
  "MPESA_CONSUMER_KEY",
  "MPESA_CONSUMER_SECRET",
  "MPESA_SHORTCODE",
  "MPESA_PASSKEY",
  "MPESA_CALLBACK_URL",
  "SMS_PROVIDER"
];

// Warn if required vars are missing
requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[env.js] ⚠️  Missing required environment variable: ${key}`);
  }
});

const config = {
  // App info
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || "http://localhost:3000",

  // M-Pesa settings
  mpesa: {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    shortcode: process.env.MPESA_SHORTCODE,
    passkey: process.env.MPESA_PASSKEY,
    baseUrl: process.env.MPESA_BASE_URL || "https://sandbox.safaricom.co.ke",
    callbackUrl: process.env.MPESA_CALLBACK_URL,
    donationCallbackUrl: process.env.MPESA_DONATION_CALLBACK_URL
  },

  // SMS Gateway
  sms: {
    provider: process.env.SMS_PROVIDER || "africastalking",

    africastalking: {
      username: process.env.AT_USERNAME,
      apiKey: process.env.AT_API_KEY,
      senderId: process.env.AT_SENDER_ID || "NyikwaRamogi"
    },

    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      senderNumber: process.env.TWILIO_SENDER_NUMBER
    }
  },

  // Other environment variables can be added here
};

module.exports = config;
