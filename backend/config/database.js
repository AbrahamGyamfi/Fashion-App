const { Pool } = require('pg');

// Construct DATABASE_URL from environment variables or use default
const DATABASE_URL = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER || 'admin'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'shopnow'}`;

const pool = new Pool({ 
  connectionString: DATABASE_URL
});

module.exports = pool;