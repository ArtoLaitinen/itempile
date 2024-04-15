const request = require('supertest');
const supertest = require('supertest');
const {
  describe, test, expect, beforeAll,
} = require('@jest/globals');
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
        expect(item).toHaveProperty('user_name');
        expect(item).toHaveProperty('user_email');
      });
    });
  });

  describe('GET item by id endpoint', () => {
    test('should return 200 and one item', async () => {
      const response = await request(app)
        .get('/api/items/2')
        .set('Accept', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toMatch(/json/);

      // using the values of item id 2 because it is always in the database because of init.sql
      expect(response.body).toEqual(
        expect.objectContaining({
          id: 2,
          title: 'test2',
          description: 'test desc',
          image: 'test image',
          category: 'test category',
          price: '123',
          owner_id: '6eb7a265-d3c1-4780-88cd-54ea3bc7ab59',
          user_name: 'dev2',
          user_email: 'dev@gmail.com',
        }),
      );
    });

    test('should return 404 for unknown item', async () => {
      const response = await request(app)
        .get('/api/items/67418')
        .set('Accept', 'application/json');

      expect(response.status).toEqual(404);
      expect(response.headers['content-type']).toMatch(/json/);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Item not found',
        }),
      );
    });
  });
});

describe('Endpoints using middleware:', () => {
  const loggedInUser = {
    userId: '',
    email: '',
    token: '',
  };

  beforeAll(async () => {
    await pool.query('DELETE FROM users WHERE email=?', ['test@email.com']);

    const data = {
      name: 'tester',
      email: 'test@email.com',
      password: 'good_password',
    };

    const response = await supertest(app)
      .post('/api/users/signup')
      .set('Accept', 'application/json')
      .send(data);

    loggedInUser.userId = response.body.id;
    loggedInUser.email = response.body.email;
    loggedInUser.token = response.body.token;
  });

  describe('GET items by user id endpoint', () => {
    test('should return 200 and items added by user', async () => {
      // using a user id that is also used in init.sql
      const userId = '2bfd3e62-6fd4-48bf-be7e-f694f880b10e';

      const response = await request(app)
        .get(`/api/items/user/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `BEARER ${loggedInUser.token}`);

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
        expect(item.owner_id).toEqual(userId);
        expect(item).toHaveProperty('created');
        expect(item).toHaveProperty('updated');
        expect(item).toHaveProperty('user_name');
        expect(item).toHaveProperty('user_email');
      });
    });

    test('should return 404 if no items found', async () => {
      const userId = '086093ea-91f6-4641-969c-387a31371fdb';

      const response = await request(app)
        .get(`/api/items/user/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `BEARER ${loggedInUser.token}`);

      expect(response.status).toEqual(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Items not found',
        }),
      );
    });

    test('should fail without authorization token', async () => {
      const userId = '2bfd3e62-6fd4-48bf-be7e-f694f880b10e';

      const response = await request(app)
        .get(`/api/items/user/${userId}`)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Authorization failed',
        }),
      );
    });
  });
});
