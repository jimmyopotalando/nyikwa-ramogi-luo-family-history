// tests/sms.test.js
const request = require('supertest');
const app = require('../backend/server');

describe('SMS API Tests', () => {
  test('POST /api/sms with missing fields returns 400', async () => {
    const res = await request(app)
      .post('/api/sms')
      .send({ message: 'Hello' }); // Missing phoneNumber

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/phoneNumber/i);
  });

  test('POST /api/sms with valid data sends SMS successfully', async () => {
    // Optionally mock smsService.sendSMS to avoid actual SMS sending during tests

    const payload = {
      phoneNumber: '254700123456',
      message: 'Test SMS message',
    };

    const res = await request(app)
      .post('/api/sms')
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('SMS sent successfully');
  });

  test('POST /api/sms handles SMS service failure gracefully', async () => {
    // You can mock smsService.sendSMS to throw an error to test failure handling

    const payload = {
      phoneNumber: '254700123456',
      message: 'Test SMS failure',
    };

    // For example, if using Jest mock:
    // jest.spyOn(require('../backend/services/smsService'), 'sendSMS').mockImplementation(() => {
    //   throw new Error('SMS gateway error');
    // });

    const res = await request(app)
      .post('/api/sms')
      .send(payload);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/failed/i);
  });
});
