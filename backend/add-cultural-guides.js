const pool = require('./config/database');

async function addCulturalGuides() {
  try {
    console.log('Adding cultural fashion guides...');
    
    // Check if guides already exist
    const checkResult = await pool.query(
      "SELECT COUNT(*) FROM fashion_guides WHERE title IN ('African Fashion Heritage', 'Asian Fashion Aesthetics')"
    );
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      console.log('Cultural guides already exist!');
      process.exit(0);
    }
    
    // Add the guides
    await pool.query(`
      INSERT INTO fashion_guides (title, category, content, image_url, author_id, tags) VALUES
      ('African Fashion Heritage', 'Cultural Fashion', 'African fashion celebrates vibrant prints, bold patterns, and rich cultural heritage. From Ankara wax prints to Kente cloth, each pattern tells a story. Modern designers blend traditional textiles with contemporary silhouettes, creating stunning fusion pieces that honor heritage while embracing innovation.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', 1, ARRAY['african', 'cultural', 'heritage']),
      ('Asian Fashion Aesthetics', 'Cultural Fashion', 'Asian fashion combines minimalist aesthetics with intricate details. From Japanese kimono-inspired designs to Korean hanbok fusion, Asian fashion emphasizes clean lines, quality fabrics, and thoughtful construction. Modern interpretations blend traditional elements with contemporary streetwear.', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500', 1, ARRAY['asian', 'cultural', 'minimalism'])
    `);
    
    console.log('✓ Cultural fashion guides added successfully!');
    
    // Verify
    const verifyResult = await pool.query('SELECT COUNT(*) FROM fashion_guides');
    console.log(`Total guides in database: ${verifyResult.rows[0].count}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error adding guides:', err.message);
    process.exit(1);
  }
}

addCulturalGuides();
