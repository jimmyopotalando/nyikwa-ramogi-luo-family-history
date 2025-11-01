// tests/clanApi.test.js
const request = require('supertest');
const app = require('../backend/server'); // Your Express app

describe('Clan API Tests', () => {
  test('GET /api/clans without county query returns 400', async () => {
    const res = await request(app).get('/api/clans');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('County query parameter is required');
  });

  test('GET /api/clans with invalid county returns 404', async () => {
    const res = await request(app).get('/api/clans?county=InvalidCounty');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('County not found');
  });

  test('GET /api/clans with valid county returns clans list', async () => {
    const res = await request(app).get('/api/clans?county=Kisumu');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body).toContain('Kajulu');
  });
});
