const axios = require('axios');
const mpesaConfig = require('../config/mpesaConfig');
const logger = require('../utils/logger');

let accessToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const auth = Buffer.from(`${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`).toString('base64');
    const response = await axios.get(mpesaConfig.baseUrl + mpesaConfig.endpoints.oauth, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

    logger.info('M-Pesa access token acquired');

    return accessToken;
  } catch (error) {
    logger.error('Error obtaining M-Pesa access token:', error.message);
    throw new Error('Failed to obtain M-Pesa access token');
  }
}

async function stkPush({ phoneNumber, amount, accountReference, transactionDesc }) {
  try {
    const token = await getAccessToken();

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const passkey = mpesaConfig.passkey;
    const shortcode = mpesaConfig.shortcode;

    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

    const stkPushPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: mpesaConfig.callbackUrls.clan,  // or whichever callback you want
      AccountReference: accountReference || mpesaConfig.accountReference,
      TransactionDesc: transactionDesc || mpesaConfig.transactionDesc,
    };

    const response = await axios.post(mpesaConfig.baseUrl + mpesaConfig.endpoints.stkPush, stkPushPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.ResponseCode === '0') {
      logger.info(`STK Push initiated successfully for ${phoneNumber} Amount: ${amount}`);
      return response.data;
    } else {
      logger.error('Failed to initiate STK Push:', response.data.ResponseDescription);
      throw new Error(response.data.ResponseDescription);
    }
  } catch (error) {
    logger.error('Error initiating STK Push:', error.message);
    throw error;
  }
}

module.exports = {
  stkPush,
};
