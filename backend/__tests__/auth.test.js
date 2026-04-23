const request = require('supertest');
const express = require('express');

jest.mock('../config/database', () => ({
  query: jest.fn()
}));

const db = require('../config/database');

describe('Auth API Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
        user_type: 'buyer'
      };

      db.query.mockResolvedValueOnce({ 
        rows: [{ 
          id: 1, 
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          user_type: newUser.user_type,
          created_at: new Date()
        }] 
      });

      const authRoute = require('../routes/auth');
      app.use('/api/auth', authRoute);

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(newUser.email);
    });

    it('should reject duplicate email', async () => {
      const existingUser = {
        email: 'existing@example.com',
        password: 'password123',
        first_name: 'Existing',
        last_name: 'User'
      };

      const dbError = new Error('duplicate key value');
      dbError.code = '23505';
      db.query.mockRejectedValueOnce(dbError);

      const authRoute = require('../routes/auth');
      app.use('/api/auth', authRoute);

      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      db.query.mockResolvedValue({ 
        rows: [{ 
          id: 1, 
          email: credentials.email, 
          password: credentials.password 
        }] 
      });

      const authRoute = require('../routes/auth');
      app.use('/api/auth', authRoute);

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });

    it('should reject invalid credentials', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const authRoute = require('../routes/auth');
      app.use('/api/auth', authRoute);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrong' });

      expect(response.status).toBe(401);
    });
  });
});
