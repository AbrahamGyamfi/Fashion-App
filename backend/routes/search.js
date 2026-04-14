const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const redisClient = require('../config/redis');

router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy, designer } = req.query;
    
    // Create cache key from query params
    const cacheKey = `search:${JSON.stringify(req.query)}`;
    
    // Try cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    let query = 'SELECT p.*, d.brand_name as designer_name, d.verified as designer_verified FROM products p LEFT JOIN designers d ON p.designer_id = d.id WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND p.category = $${paramCount++}`;
      params.push(category);
    }
    if (search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }
    if (minPrice) {
      query += ` AND p.price >= $${paramCount++}`;
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ` AND p.price <= $${paramCount++}`;
      params.push(maxPrice);
    }
    if (designer) {
      query += ` AND p.designer_id = $${paramCount++}`;
      params.push(designer);
    }

    if (sortBy === 'price_asc') query += ' ORDER BY p.price ASC';
    else if (sortBy === 'price_desc') query += ' ORDER BY p.price DESC';
    else if (sortBy === 'name') query += ' ORDER BY p.name ASC';
    else query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    
    // Cache for 5 minutes
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result.rows));
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
