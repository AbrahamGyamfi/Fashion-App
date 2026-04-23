const express = require('express');
const cors = require('cors');
const redisClient = require('./config/redis');
const initDatabase = require('./models/init');
// Infrastructure update: Fixed S3 backend configuration

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/designers', require('./routes/designers'));
app.use('/api/search', require('./routes/search'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/fashion', require('./routes/fashion'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Initialize and start
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
