const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const app = require('../app.js');
const users = require('../models/users.js');

// mocking external modules
jest.mock('bcryptjs');
jest.mock('../models/users');

describe('Users', () => {
  describe('signup endpoint', () => {
    beforeEach(() => {
      users.findByEmail.mockResolvedValue([]);
      users.create.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('hashedPassword');
    });

    test('should create a new user', async () => {
      const user = {
        name: 'test-user',
        email: 'test-user@email.com',
        password: 'test_password',
      };

      const response = await request(app)
        .post('/api/users/signup')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .send(user);

      expect(response.status).toEqual(201);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.id).toBeTruthy();
      expect(response.body.email).toEqual('test-user@email.com');
      expect(response.body.token).toBeTruthy();
    });

    test('should fail if user with that email already exists', async () => {
      users.findByEmail.mockResolvedValue([{ id: uuidv4(), email: 'test-user@email.com' }]);

      const user = {
        name: 'test-user',
        email: 'test-user@email.com',
        password: 'test_password',
      };

      const response = await request(app)
        .post('/api/users/signup')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .send(user);

      expect(response.status).toEqual(422);
      expect(response.body).toEqual({ message: 'Could not create user, user exists' });
    });

    test('should fail without some parameter', async () => {
      const user = {
        name: 'test-user',
        password: 'test_password',
      };

      const response = await request(app)
        .post('/api/users/signup')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .send(user);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: '"email" is required' });
    });

    test('should fail if some parameter is empty', async () => {
      const user = {
        name: '',
        email: 'test-user@email.com',
        password: 'test_password',
      };

      const response = await request(app)
        .post('/api/users/signup')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .send(user);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: '"name" is not allowed to be empty' });
    });

    test('should fail if email is invalid', async () => {
      const user = {
        name: 'test-user3',
        email: 'thisIsNotAnEmail',
        password: 'test_password',
      };

      const response = await request(app)
        .post('/api/users/signup')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(user);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: '"email" must be a valid email' });
    });
  });
});
