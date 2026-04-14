const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const redisClient = require('../config/redis');

// Get user cart
router.get('/:userId', async (req, res) => {
  try {
    // Try cache first
    const cached = await redisClient.get(`cart:${req.params.userId}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // Get from database
    const result = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1',
      [req.params.userId]
    );
    
    // Cache the result
    await redisClient.setEx(`cart:${req.params.userId}`, 300, JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add item to cart
router.post('/:userId/items', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Check if item exists
    const existing = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.params.userId, productId]
    );
    
    if (existing.rows.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3',
        [quantity, req.params.userId, productId]
      );
    } else {
      // Insert new item
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [req.params.userId, productId, quantity]
      );
    }
    
    // Invalidate cache
    await redisClient.del(`cart:${req.params.userId}`);
    
    // Get updated cart
    const result = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1',
      [req.params.userId]
    );
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update cart item quantity
router.patch('/:userId/items/:productId', async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      // Remove item
      await pool.query(
        'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [req.params.userId, req.params.productId]
      );
    } else {
      // Update quantity
      await pool.query(
        'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
        [quantity, req.params.userId, req.params.productId]
      );
    }
    
    // Invalidate cache
    await redisClient.del(`cart:${req.params.userId}`);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item from cart
router.delete('/:userId/items/:productId', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.params.userId, req.params.productId]
    );
    
    // Invalidate cache
    await redisClient.del(`cart:${req.params.userId}`);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
