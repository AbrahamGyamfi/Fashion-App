const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const redisClient = require('../config/redis');

router.get('/', async (req, res) => {
  try {
    const cached = await redisClient.get('products:all');
    if (cached) return res.json(JSON.parse(cached));

    const result = await pool.query(`
      SELECT p.*, d.brand_name, d.logo_url, d.verified, d.rating as designer_rating
      FROM products p
      LEFT JOIN designers d ON p.designer_id = d.id
      WHERE p.status = 'approved'
      ORDER BY p.created_at DESC
    `);
    await redisClient.setEx('products:all', 60, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, d.brand_name, d.logo_url, d.verified
      FROM products p
      LEFT JOIN designers d ON p.designer_id = d.id
      WHERE p.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { designer_id, name, price, stock, category, size, color, image_url } = req.body;
    const result = await pool.query(
      'INSERT INTO products (designer_id, name, price, stock, category, size, color, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [designer_id || null, name, price, stock, category || null, size || null, color || null, image_url || null]
    );
    
    // Invalidate all product and search caches
    await redisClient.del('products:all');
    const keys = await redisClient.keys('search:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.first_name, u.last_name, u.avatar_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
