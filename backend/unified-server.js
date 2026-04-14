const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

// Database and cache clients
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5432/shopnow' });
const redisClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

// Initialize
(async () => {
  try {
    console.log('Connecting to Redis...');
    await redisClient.connect();
    console.log('✓ Redis connected');
    
    console.log('Initializing database...');
    await initDatabase();
    console.log('✓ Database ready');
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`\n✓ Backend running on http://localhost:${PORT}\n`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
})();

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      avatar_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS designers (
      id SERIAL PRIMARY KEY,
      brand_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      logo_url TEXT,
      cover_image_url TEXT,
      website_url TEXT,
      instagram_url TEXT,
      facebook_url TEXT,
      subscription_tier VARCHAR(50) DEFAULT 'basic',
      commission_rate DECIMAL(5,2) DEFAULT 15.00,
      verified BOOLEAN DEFAULT false,
      rating DECIMAL(3,2) DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      designer_id INTEGER REFERENCES designers(id),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      image_url TEXT,
      category VARCHAR(100),
      sizes TEXT[],
      colors TEXT[],
      stock INTEGER DEFAULT 0,
      status VARCHAR(50) DEFAULT 'active',
      featured BOOLEAN DEFAULT false,
      rating DECIMAL(3,2) DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      user_id INTEGER REFERENCES users(id),
      product_id INTEGER REFERENCES products(id),
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id),
      user_id INTEGER REFERENCES users(id),
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      title VARCHAR(255),
      comment TEXT,
      verified_purchase BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS designer_reviews (
      id SERIAL PRIMARY KEY,
      designer_id INTEGER REFERENCES designers(id),
      user_id INTEGER REFERENCES users(id),
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const { rows } = await pool.query('SELECT COUNT(*) FROM products');
  if (rows[0].count === '0') await seedData();
}

async function seedData() {
  console.log('Seeding database (first time only)...');
  
  await pool.query(`
    INSERT INTO users (email, password_hash, first_name, last_name) VALUES
    ('john@example.com', 'hash123', 'John', 'Doe'),
    ('jane@example.com', 'hash123', 'Jane', 'Smith'),
    ('bob@example.com', 'hash123', 'Bob', 'Johnson');

    INSERT INTO designers (brand_name, email, description, subscription_tier, verified, website_url, instagram_url) VALUES
    ('Urban Threads', 'urban@example.com', 'Modern streetwear for the urban lifestyle.', 'premium', true, 'https://urbanthreads.com', 'https://instagram.com/urbanthreads'),
    ('Elegant Designs', 'elegant@example.com', 'Timeless elegance meets contemporary fashion.', 'basic', true, 'https://elegantdesigns.com', 'https://instagram.com/elegantdesigns'),
    ('EcoWear', 'eco@example.com', 'Sustainable fashion for a better tomorrow.', 'premium', true, 'https://ecowear.com', 'https://instagram.com/ecowear');

    INSERT INTO products (designer_id, name, price, stock, category, size, color, image_url, featured, status) VALUES
    (1, 'Classic White T-Shirt', 29.99, 50, 'Tops', 'M', 'White', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', true, 'approved'),
    (1, 'Slim Fit Jeans', 79.99, 30, 'Bottoms', 'L', 'Blue', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', false, 'approved'),
    (2, 'Leather Jacket', 199.99, 15, 'Outerwear', 'M', 'Black', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', true, 'approved'),
    (2, 'Summer Dress', 89.99, 25, 'Dresses', 'S', 'Floral', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', false, 'approved'),
    (3, 'White Sneakers', 119.99, 40, 'Footwear', '42', 'White', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', true, 'approved');

    INSERT INTO reviews (product_id, user_id, rating, title, comment, verified_purchase) VALUES
    (1, 1, 5, 'Perfect fit!', 'Love this t-shirt!', true),
    (1, 2, 4, 'Great quality', 'Really nice material.', true),
    (3, 1, 5, 'Best jacket ever', 'Worth every penny!', true);

    INSERT INTO designer_reviews (designer_id, user_id, rating, comment) VALUES
    (1, 1, 5, 'Urban Threads never disappoints!'),
    (2, 1, 5, 'Elegant Designs lives up to their name!');

    UPDATE products p SET 
      rating = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE product_id = p.id), 0),
      review_count = COALESCE((SELECT COUNT(*) FROM reviews WHERE product_id = p.id), 0);

    UPDATE designers d SET 
      rating = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM designer_reviews WHERE designer_id = d.id), 0),
      review_count = COALESCE((SELECT COUNT(*) FROM designer_reviews WHERE designer_id = d.id), 0);
  `);
  
  console.log('✓ Sample data loaded');
}

// Product routes
app.get('/api/products', async (req, res) => {
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

app.get('/api/products/:id', async (req, res) => {
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

app.post('/api/products', async (req, res) => {
  try {
    const { designer_id, name, price, stock, category, size, color, image_url } = req.body;
    const result = await pool.query(
      'INSERT INTO products (designer_id, name, price, stock, category, size, color, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [designer_id || null, name, price, stock, category || null, size || null, color || null, image_url || null]
    );
    await redisClient.del('products:all');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search routes
app.get('/api/search', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy, designer } = req.query;
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
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total, AVG(price) as avg_price, MIN(price) as min_price, MAX(price) as max_price FROM products');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cart routes
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const cart = await redisClient.get(`cart:${req.params.userId}`);
    res.json(cart ? JSON.parse(cart) : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cart/:userId/items', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = JSON.parse(await redisClient.get(`cart:${req.params.userId}`) || '[]');
    const existing = cart.find(item => item.productId === productId);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    
    await redisClient.set(`cart:${req.params.userId}`, JSON.stringify(cart));
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Designer routes
app.get('/api/designers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM designers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/designers/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM designers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Designer not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/designers/:id/products', async (req, res) => {
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

app.get('/api/products/:id/reviews', async (req, res) => {
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

app.get('/api/designers/:id/reviews', async (req, res) => {
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

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));


