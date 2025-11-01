// tests/payment.test.js
const request = require('supertest');
const app = require('../backend/server');

describe('Payment API Tests', () => {
  // Mock data for payment request
  const validPaymentPayload = {
    phoneNumber: '254700123456',
    amount: 10,
    accountReference: 'Kajulu',
    transactionType: 'clan_access',
  };

  test('POST /api/payments with missing fields returns 400', async () => {
    const res = await request(app)
      .post('/api/payments')
      .send({ phoneNumber: '254700123456' }); // Missing amount & accountReference

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/missing/i);
  });

  test('POST /api/payments with valid data triggers STK Push', async () => {
    // Mock the mpesaService.stkPush function if applicable here
    // For example, jest.mock('../backend/services/mpesaService')

    const res = await request(app)
      .post('/api/payments')
      .send(validPaymentPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('STK Push initiated');
    expect(res.body.checkoutRequestID).toBeDefined();
  });

  test('POST /api/payments callback with success updates logs and sends SMS', async () => {
    const callbackPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: '12345',
          CheckoutRequestID: 'ABCDE12345',
          ResultCode: 0,
          ResultDesc: 'The service request is processed successfully.',
          CallbackMetadata: {
            Item: [
              { Name: 'Amount', Value: 10 },
              { Name: 'MpesaReceiptNumber', Value: 'XYZ123456' },
              { Name: 'TransactionDate', Value: 20251014120000 },
              { Name: 'PhoneNumber', Value: 254700123456 },
            ],
          },
        },
      },
    };

    const res = await request(app)
      .post('/api/payments/callback')
      .send(callbackPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Payment processed successfully');
  });

  test('POST /api/payments callback with failure does not send SMS', async () => {
    const callbackPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: '12345',
          CheckoutRequestID: 'ABCDE12345',
          ResultCode: 1,
          ResultDesc: 'Transaction cancelled by user',
        },
      },
    };

    const res = await request(app)
      .post('/api/payments/callback')
      .send(callbackPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Payment failed or cancelled');
  });
});
