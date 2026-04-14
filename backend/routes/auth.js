const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, user_type, brand_name, description } = req.body;
    
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, user_type, created_at',
      [email, password, first_name, last_name, user_type || 'buyer']
    );
    
    const user = userResult.rows[0];
    
    if (user_type === 'vendor' && brand_name) {
      await pool.query(
        'INSERT INTO designers (user_id, brand_name, email, description, subscription_tier, verified) VALUES ($1, $2, $3, $4, $5, $6)',
        [user.id, brand_name, email, description || '', 'basic', false]
      );
    }
    
    res.json(user);
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, user_type, avatar_url FROM users WHERE email = $1 AND password_hash = $2',
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
