const request = require('supertest');
const express = require('express');

// Mock database
jest.mock('../config/database', () => ({
  query: jest.fn()
}));

const db = require('../config/database');

describe('Products API', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 }
      ];

      db.query.mockResolvedValue({ rows: mockProducts });

      const productsRoute = require('../routes/products');
      app.use('/api/products', productsRoute);

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(db.query).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      db.query.mockRejectedValue(new Error('Database error'));

      const productsRoute = require('../routes/products');
      app.use('/api/products', productsRoute);

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 100 };

      db.query.mockResolvedValue({ rows: [mockProduct] });

      const productsRoute = require('../routes/products');
      app.use('/api/products', productsRoute);

      const response = await request(app).get('/api/products/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Product 1');
    });

    it('should return 404 for non-existent product', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const productsRoute = require('../routes/products');
      app.use('/api/products', productsRoute);

      const response = await request(app).get('/api/products/999');

      expect(response.status).toBe(404);
    });
  });
});
