const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5432/shopnow' 
});

module.exports = pool;
