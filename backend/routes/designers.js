const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM designers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM designers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Designer not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, d.brand_name, d.logo_url, d.verified
      FROM products p
      JOIN designers d ON p.designer_id = d.id
      WHERE p.designer_id = $1 AND p.status = 'approved'
      ORDER BY p.created_at DESC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT dr.*, u.first_name, u.last_name, u.avatar_url
      FROM designer_reviews dr
      JOIN users u ON dr.user_id = u.id
      WHERE dr.designer_id = $1
      ORDER BY dr.created_at DESC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
