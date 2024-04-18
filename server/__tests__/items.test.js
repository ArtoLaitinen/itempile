const request = require('supertest');
const supertest = require('supertest');
const {
  describe, test, expect, beforeAll,
} = require('@jest/globals');
const pool = require('../db/pool.js');

const app = require('../app.js');

const existingUserId = '2bfd3e62-6fd4-48bf-be7e-f694f880b10e';

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
      const response = await request(app)
        .get(`/api/items/user/${existingUserId}`)
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
        expect(item.owner_id).toEqual(existingUserId);
        expect(item).toHaveProperty('created');
        expect(item).toHaveProperty('updated');
        expect(item).toHaveProperty('user_name');
        expect(item).toHaveProperty('user_email');
      });
    });

    test('should return 404 if no items found', async () => {
      const nonExistentUserId = '086093ea-91f6-4641-969c-387a31371fdb';

      const response = await request(app)
        .get(`/api/items/user/${nonExistentUserId}`)
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
      const response = await request(app)
        .get(`/api/items/user/${existingUserId}`)
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

  describe('Create a new item endpoint', () => {
    test('should create a new item', async () => {
      const item = {
        title: 'test item 1',
        description: 'test item 1 description',
        image: 'image.jpg',
        category: 'test category',
        price: '20',
        owner_id: existingUserId,
      };

      const response = await request(app)
        .post('/api/items')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .set('Authorization', `BEARER ${loggedInUser.token}`)
        .send(item);

      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toEqual('test item 1');
      expect(response.body.description).toEqual('test item 1 description');
      expect(response.body.image).toEqual('image.jpg');
      expect(response.body.category).toEqual('test category');
      expect(response.body.price).toEqual('20');
      expect(response.body.owner_id).toEqual(existingUserId);
      expect(response.body.created).toBeTruthy();
      expect(response.body.updated).toBeTruthy();
    });

    test('should fail with empty parameter', async () => {
      const item = {
        title: '',
        description: 'test item 1 description',
        image: 'image.jpg',
        category: 'test category',
        price: '20',
        owner_id: existingUserId,
      };

      const response = await request(app)
        .post('/api/items')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .set('Authorization', `BEARER ${loggedInUser.token}`)
        .send(item);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: '"title" is not allowed to be empty' });
    });

    test('should fail with one parameter missing', async () => {
      const item = {
        title: 'test item 1',
        description: 'test item 1 description',
        image: 'image.jpg',
        category: 'test category',
        owner_id: existingUserId,
      };

      const response = await request(app)
        .post('/api/items')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .set('Authorization', `BEARER ${loggedInUser.token}`)
        .send(item);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: '"price" is required' });
    });

    test('should fail if price is not string', async () => {
      const item = {
        title: 'test item 1',
        description: 'test item 1 description',
        image: 'image.jpg',
        category: 'test category',
        price: 20,
        owner_id: existingUserId,
      };

      const response = await request(app)
        .post('/api/items')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .set('Authorization', `BEARER ${loggedInUser.token}`)
        .send(item);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: '"price" must be a string' });
    });

    test('should fail without authorization token', async () => {
      const item = {
        title: 'test item 1',
        description: 'test item 1 description',
        image: 'image.jpg',
        category: 'test category',
        price: '20',
        owner_id: existingUserId,
      };

      const response = await request(app)
        .post('/api/items')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .send(item);

      expect(response.status).toEqual(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Authorization failed',
        }),
      );
    });
  });

  describe('Update an item endpoint', () => {
    test('should update an item', async () => {
      const data = {
        title: 'Update me',
        description: 'Update me',
        image: 'image.jpg',
        category: 'test category',
        price: '20',
        owner_id: existingUserId,
      };

      const createdItemResponse = await request(app)
        .post('/api/items')
        .set('Accept', 'application/json')
        .set('Authorization', `BEARER ${loggedInUser.token}`)
        .send(data);

      const createdItemId = createdItemResponse.body.id;

      const updatedValues = {
        title: 'updated title',
        description: 'updated description',
      };

      const response = await request(app)
        .put(`/api/items/${createdItemId}`)
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .set('Authorization', `BEARER ${loggedInUser.token}`)
        .send(updatedValues);

      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toEqual('updated title');
      expect(response.body.description).toEqual('updated description');
      expect(response.body.image).toEqual('image.jpg');
      expect(response.body.category).toEqual('test category');
      expect(response.body.price).toEqual('20');
      expect(response.body.owner_id).toEqual(existingUserId);
      expect(response.body.created).toBeTruthy();
      expect(response.body.updated).toBeTruthy();
    });

    test('should fail if parameter is empty', async () => {
      const updatedValues = {
        title: '',
      };

      const response = await request(app)
        .put('/api/items/2')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .set('Authorization', `BEARER ${loggedInUser.token}`)
        .send(updatedValues);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: '"title" is not allowed to be empty' });
    });

    test('should fail if the item doesnt exist', async () => {
      const updatedValues = {
        title: 'new title',
      };

      const response = await request(app)
        .put('/api/items/46278164')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .set('Authorization', `BEARER ${loggedInUser.token}`)
        .send(updatedValues);

      expect(response.status).toEqual(404);
      expect(response.headers['content-type']).toMatch(/json/);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Item not found',
        }),
      );
    });

    test('should fail without authorization token', async () => {
      const updatedValues = {
        title: 'new title',
      };

      const response = await request(app)
        .post('/api/items/2')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .send(updatedValues);

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
