const request = require('supertest');
const supertest = require('supertest');
const { describe, test, expect } = require('@jest/globals');
const pool = require('../db/pool.js');

const app = require('../app.js');

afterAll(async () => {
  await pool.end();
});

describe('Endpoints not using middleware: ', () => {
  describe('GET all items endpoint', () => {
    test('should return 200 and valid JSON with correct structure', async () => {
      const response = await request(app)
        .get('/api/items')
        .set('Accept', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(Array.isArray(response.body)).toBe(true);

      response.body.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('image');
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('owner_id');
        expect(item).toHaveProperty('created');
        expect(item).toHaveProperty('updated');
        expect(item).toHaveProperty('user_id');
        expect(item).toHaveProperty('user_name');
        expect(item).toHaveProperty('user_email');
      });
    });
  });
});
