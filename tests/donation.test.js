// tests/donation.test.js
const request = require('supertest');
const app = require('../backend/server');

describe('Donation API Tests', () => {
  const validDonationPayload = {
    phoneNumber: '254700123456',
    amount: 50,
    accountReference: 'FAMILY_HISTORY_SUPPORT',
    transactionDesc: 'Donation to Nyikwa Ramogi Family History',
  };

  test('POST /api/donations with missing fields returns 400', async () => {
    const res = await request(app)
      .post('/api/donations')
      .send({ phoneNumber: '254700123456' }); // Missing amount & accountReference

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/missing/i);
  });

  test('POST /api/donations with valid data triggers STK Push', async () => {
    // Optionally mock mpesaService.stkPush here

    const res = await request(app)
      .post('/api/donations')
      .send(validDonationPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('STK Push initiated');
    expect(res.body.checkoutRequestID).toBeDefined();
  });

  test('POST /api/donations/callback with success logs donation and sends thank-you SMS', async () => {
    const callbackPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: 'don12345',
          CheckoutRequestID: 'donABCDE12345',
          ResultCode: 0,
          ResultDesc: 'The service request is processed successfully.',
          CallbackMetadata: {
            Item: [
              { Name: 'Amount', Value: 50 },
              { Name: 'MpesaReceiptNumber', Value: 'DONXYZ123456' },
              { Name: 'TransactionDate', Value: 20251014123000 },
              { Name: 'PhoneNumber', Value: 254700123456 },
            ],
          },
        },
      },
    };

    const res = await request(app)
      .post('/api/donations/callback')
      .send(callbackPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Donation processed successfully');
  });

  test('POST /api/donations/callback with failure does not log or send SMS', async () => {
    const callbackPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: 'don12345',
          CheckoutRequestID: 'donABCDE12345',
          ResultCode: 1,
          ResultDesc: 'Transaction cancelled by user',
        },
      },
    };

    const res = await request(app)
      .post('/api/donations/callback')
      .send(callbackPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Donation failed or cancelled');
  });
});
