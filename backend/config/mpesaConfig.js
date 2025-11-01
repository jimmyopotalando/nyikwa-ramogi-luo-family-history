// config/mpesaConfig.js

/**
 * M-Pesa Configuration Module
 * Loads Lipa na M-Pesa API settings from .env
 */

const dotenv = require("dotenv");
dotenv.config();

const requiredEnv = [
  "MPESA_CONSUMER_KEY",
  "MPESA_CONSUMER_SECRET",
  "MPESA_SHORTCODE",
  "MPESA_PASSKEY",
  "MPESA_CALLBACK_URL",
  "MPESA_DONATION_CALLBACK_URL"
];

// Validate required environment variables
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`[mpesaConfig] Warning: Missing environment variable ${key}`);
  }
}

module.exports = {
  // App credentials
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,

  // Business shortcode (Paybill or Till Number)
  shortcode: process.env.MPESA_SHORTCODE,

  // Passkey from Safaricom Developer Portal
  passkey: process.env.MPESA_PASSKEY,

  // M-Pesa API Base URL
  baseUrl: process.env.MPESA_BASE_URL || "https://sandbox.safaricom.co.ke",

  // STK Push Callback URLs
  callbackUrls: {
    clan: process.env.MPESA_CALLBACK_URL || "https://yourdomain.com/api/payments/callback",
    donation: process.env.MPESA_DONATION_CALLBACK_URL || "https://yourdomain.com/api/donations/callback"
  },

  // Lipa na M-Pesa Online Endpoint
  endpoints: {
    oauth: "/oauth/v1/generate?grant_type=client_credentials",
    stkPush: "/mpesa/stkpush/v1/processrequest",
    stkCallback: "/mpesa/stkpushquery/v1/query"
  },

  // Optional: Default descriptions
  accountReference: "NyikwaRamogi",
  transactionDesc: "Nyikwa Ramogi Family History Access"
};
