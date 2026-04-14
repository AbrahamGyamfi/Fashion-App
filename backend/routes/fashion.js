const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all fashion guides
router.get('/guides', async (req, res) => {
  try {
    const { category } = req.query;
    let query = `
      SELECT fg.*, u.first_name, u.last_name 
      FROM fashion_guides fg
      LEFT JOIN users u ON fg.author_id = u.id
      ORDER BY fg.created_at DESC
    `;
    
    if (category) {
      query = `
        SELECT fg.*, u.first_name, u.last_name 
        FROM fashion_guides fg
        LEFT JOIN users u ON fg.author_id = u.id
        WHERE fg.category = $1
        ORDER BY fg.created_at DESC
      `;
      const result = await pool.query(query, [category]);
      return res.json(result.rows);
    }
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single fashion guide
router.get('/guides/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT fg.*, u.first_name, u.last_name 
       FROM fashion_guides fg
       LEFT JOIN users u ON fg.author_id = u.id
       WHERE fg.id = $1`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guide not found' });
    }
    
    // Increment views
    await pool.query('UPDATE fashion_guides SET views = views + 1 WHERE id = $1', [req.params.id]);
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all outfit ideas
router.get('/outfits', async (req, res) => {
  try {
    const { occasion, season, style_type } = req.query;
    let query = 'SELECT * FROM outfit_ideas ORDER BY created_at DESC';
    const params = [];
    
    if (occasion || season || style_type) {
      const conditions = [];
      if (occasion) {
        params.push(occasion);
        conditions.push(`occasion = $${params.length}`);
      }
      if (season) {
        params.push(season);
        conditions.push(`season = $${params.length}`);
      }
      if (style_type) {
        params.push(style_type);
        conditions.push(`style_type = $${params.length}`);
      }
      query = `SELECT * FROM outfit_ideas WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single outfit idea with products
router.get('/outfits/:id', async (req, res) => {
  try {
    const outfitResult = await pool.query(
      'SELECT * FROM outfit_ideas WHERE id = $1',
      [req.params.id]
    );
    
    if (outfitResult.rows.length === 0) {
      return res.status(404).json({ error: 'Outfit not found' });
    }
    
    const outfit = outfitResult.rows[0];
    
    // Get associated products
    if (outfit.product_ids && outfit.product_ids.length > 0) {
      const productsResult = await pool.query(
        `SELECT p.*, d.brand_name, d.verified 
         FROM products p
         LEFT JOIN designers d ON p.designer_id = d.id
         WHERE p.id = ANY($1)`,
        [outfit.product_ids]
      );
      outfit.products = productsResult.rows;
    }
    
    res.json(outfit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like a guide
router.post('/guides/:id/like', async (req, res) => {
  try {
    await pool.query('UPDATE fashion_guides SET likes = likes + 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like an outfit
router.post('/outfits/:id/like', async (req, res) => {
  try {
    await pool.query('UPDATE outfit_ideas SET likes = likes + 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
