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
        name: 'Test User',
        role: 'buyer'
      };

      db.query.mockResolvedValueOnce({ rows: [] }) // Check if user exists
               .mockResolvedValueOnce({ rows: [{ id: 1, ...newUser }] }); // Insert user

      const authRoute = require('../routes/auth');
      app.use('/api/auth', authRoute);

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should reject duplicate email', async () => {
      const existingUser = {
        email: 'existing@example.com',
        password: 'password123'
      };

      db.query.mockResolvedValue({ rows: [{ id: 1 }] });

      const authRoute = require('../routes/auth');
      app.use('/api/auth', authRoute);

      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUser);

      expect(response.status).toBe(400);
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
