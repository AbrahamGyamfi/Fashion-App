const pool = require('../config/database');

async function initDatabase() {
  // Check if database is fully initialized by checking all required tables
  try {
    const tableCheck = await pool.query(`
      SELECT COUNT(*) as table_count
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'designers', 'products', 'cart_items', 'wishlists', 'reviews', 'designer_reviews', 'fashion_guides', 'outfit_ideas');
    `);
    
    const expectedTables = 9;
    const actualTables = Number.parseInt(tableCheck.rows[0].table_count, 10);
    
    if (actualTables === expectedTables) {
      console.log(`✓ Database already initialized (${actualTables}/${expectedTables} tables)`);
      return;
    } else if (actualTables > 0) {
      console.log(`⚠ Incomplete database detected (${actualTables}/${expectedTables} tables). Reinitializing...`);
    } else {
      console.log('Database not initialized, creating tables...');
    }
  } catch (err) {
    console.log('Database check failed, initializing...', err.message);
  }

  // Drop all tables to ensure clean state
  await pool.query(`
    DROP TABLE IF EXISTS cart_items CASCADE;
    DROP TABLE IF EXISTS outfit_ideas CASCADE;
    DROP TABLE IF EXISTS fashion_guides CASCADE;
    DROP TABLE IF EXISTS designer_reviews CASCADE;
    DROP TABLE IF EXISTS reviews CASCADE;
    DROP TABLE IF EXISTS wishlists CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS designers CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
  `);

  // Create tables
  await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      user_type VARCHAR(20) DEFAULT 'buyer',
      avatar_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE designers (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
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
      culture_category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      designer_id INTEGER REFERENCES designers(id),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      image_url TEXT,
      category VARCHAR(100),
      culture_category VARCHAR(100),
      size VARCHAR(50),
      color VARCHAR(50),
      stock INTEGER DEFAULT 0,
      status VARCHAR(50) DEFAULT 'approved',
      featured BOOLEAN DEFAULT false,
      rating DECIMAL(3,2) DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE wishlists (
      user_id INTEGER REFERENCES users(id),
      product_id INTEGER REFERENCES products(id),
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, product_id)
    );

    CREATE TABLE reviews (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id),
      user_id INTEGER REFERENCES users(id),
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      title VARCHAR(255),
      comment TEXT,
      verified_purchase BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE designer_reviews (
      id SERIAL PRIMARY KEY,
      designer_id INTEGER REFERENCES designers(id),
      user_id INTEGER REFERENCES users(id),
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE fashion_guides (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      content TEXT,
      image_url TEXT,
      author_id INTEGER REFERENCES users(id),
      tags TEXT[],
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE outfit_ideas (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      occasion VARCHAR(100),
      season VARCHAR(50),
      style_type VARCHAR(100),
      image_url TEXT,
      product_ids INTEGER[],
      created_by INTEGER REFERENCES users(id),
      likes INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE cart_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER DEFAULT 1,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id)
    );
  `);

  await seedData();
  
  console.log(`✓ Database initialized successfully`);
}

async function seedData() {
  console.log('Seeding database (first time only)...');
  
  await pool.query(`
    INSERT INTO users (email, password_hash, first_name, last_name, user_type) VALUES
    ('gyamfiabraham95@gmail.com', 'hash123', 'Abraham', 'Gyamfi', 'admin'),
    ('john@example.com', 'hash123', 'John', 'Doe', 'buyer'),
    ('jane@example.com', 'hash123', 'Jane', 'Smith', 'buyer'),
    ('bob@example.com', 'hash123', 'Bob', 'Johnson', 'buyer'),
    ('vendor1@example.com', 'hash123', 'Urban', 'Designer', 'vendor'),
    ('vendor2@example.com', 'hash123', 'Elegant', 'Designer', 'vendor'),
    ('vendor3@example.com', 'hash123', 'Eco', 'Designer', 'vendor');

    INSERT INTO designers (user_id, brand_name, email, description, subscription_tier, verified, website_url, instagram_url, culture_category) VALUES
    (5, 'Urban Threads', 'vendor1@example.com', 'Modern streetwear for the urban lifestyle.', 'premium', true, 'https://urbanthreads.com', 'https://instagram.com/urbanthreads', 'Western'),
    (6, 'Elegant Designs', 'vendor2@example.com', 'Timeless elegance meets contemporary fashion.', 'basic', true, 'https://elegantdesigns.com', 'https://instagram.com/elegantdesigns', 'Western'),
    (7, 'EcoWear', 'vendor3@example.com', 'Sustainable fashion for a better tomorrow.', 'premium', true, 'https://ecowear.com', 'https://instagram.com/ecowear', 'Fusion');

    INSERT INTO products (designer_id, name, price, stock, category, culture_category, size, color, image_url, featured, status) VALUES
    (1, 'Classic White T-Shirt', 29.99, 50, 'Tops', 'Western', 'M', 'White', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', true, 'approved'),
    (1, 'Slim Fit Jeans', 79.99, 30, 'Bottoms', 'Western', 'L', 'Blue', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', false, 'approved'),
    (1, 'Black Hoodie', 59.99, 45, 'Tops', 'Western', 'L', 'Black', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', false, 'approved'),
    (1, 'Cargo Pants', 89.99, 35, 'Bottoms', 'Western', 'M', 'Khaki', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500', false, 'approved'),
    (2, 'Leather Jacket', 199.99, 15, 'Outerwear', 'Western', 'M', 'Black', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', true, 'approved'),
    (2, 'Summer Dress', 89.99, 25, 'Dresses', 'Western', 'S', 'Floral', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', false, 'approved'),
    (2, 'Silk Blouse', 69.99, 20, 'Tops', 'Western', 'M', 'Cream', 'https://images.unsplash.com/photo-1564257577-7fd112d6b4fd?w=500', true, 'approved'),
    (2, 'Midi Skirt', 79.99, 18, 'Bottoms', 'Western', 'S', 'Navy', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500', false, 'approved'),
    (2, 'Wool Coat', 249.99, 10, 'Outerwear', 'Western', 'M', 'Camel', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500', true, 'approved'),
    (3, 'White Sneakers', 119.99, 40, 'Footwear', 'Fusion', '42', 'White', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', true, 'approved'),
    (3, 'Organic Cotton Tee', 39.99, 60, 'Tops', 'Fusion', 'L', 'Green', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500', false, 'approved'),
    (3, 'Recycled Denim Jacket', 129.99, 22, 'Outerwear', 'Fusion', 'M', 'Blue', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500', false, 'approved'),
    (3, 'Hemp Joggers', 69.99, 38, 'Bottoms', 'Fusion', 'L', 'Gray', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500', false, 'approved'),
    (3, 'Canvas Sneakers', 89.99, 50, 'Footwear', 'Fusion', '40', 'Beige', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500', false, 'approved'),
    (1, 'Graphic Tee', 34.99, 55, 'Tops', 'Western', 'M', 'Black', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500', false, 'approved'),
    (2, 'Evening Gown', 299.99, 8, 'Dresses', 'Western', 'M', 'Black', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500', true, 'approved');

    INSERT INTO reviews (product_id, user_id, rating, title, comment, verified_purchase) VALUES
    (1, 1, 5, 'Perfect fit!', 'Love this t-shirt!', true),
    (1, 2, 4, 'Great quality', 'Really nice material.', true),
    (3, 1, 5, 'Best jacket ever', 'Worth every penny!', true);

    INSERT INTO designer_reviews (designer_id, user_id, rating, comment) VALUES
    (1, 1, 5, 'Urban Threads never disappoints!'),
    (2, 1, 5, 'Elegant Designs lives up to their name!');

    INSERT INTO fashion_guides (title, category, content, image_url, author_id, tags) VALUES
    ('How to Layer Like a Pro', 'Styling Tips', 'Layering is an art that can transform your outfit from basic to extraordinary. Start with a fitted base layer, add a mid-layer for warmth and style, then finish with a statement outer layer. Mix textures like cotton, wool, and leather for visual interest.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500', 1, ARRAY['layering', 'winter', 'styling']),
    ('Color Theory for Fashion', 'Fashion Education', 'Understanding color theory can elevate your style game. Complementary colors (opposite on the color wheel) create bold looks, while analogous colors (next to each other) offer harmony. Neutrals like black, white, and beige are versatile bases.', 'https://images.unsplash.com/photo-1558769132-cb1aea1c8e77?w=500', 1, ARRAY['color', 'basics', 'theory']),
    ('Sustainable Fashion Guide', 'Trends', 'Sustainable fashion is not just a trend—it''s the future. Choose quality over quantity, support ethical brands, buy second-hand, and care for your clothes properly to extend their life. Every small choice makes a difference.', 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=500', 1, ARRAY['sustainable', 'eco', 'ethical']),
    ('Dressing for Your Body Type', 'Styling Tips', 'Understanding your body shape helps you choose flattering silhouettes. Pear shapes shine in A-line skirts, apple shapes look great in empire waists, hourglass figures rock fitted styles, and rectangle shapes benefit from belted looks.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500', 1, ARRAY['body-type', 'fit', 'styling']),
    ('2024 Fashion Trends', 'Trends', 'This year brings oversized blazers, wide-leg pants, bold prints, sustainable materials, and vintage revival. Mix these trends with your personal style for a fresh, modern look that feels authentically you.', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500', 1, ARRAY['trends', '2024', 'modern']),
    ('African Fashion Heritage', 'Cultural Fashion', 'African fashion celebrates vibrant prints, bold patterns, and rich cultural heritage. From Ankara wax prints to Kente cloth, each pattern tells a story. Modern designers blend traditional textiles with contemporary silhouettes, creating stunning fusion pieces that honor heritage while embracing innovation.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', 1, ARRAY['african', 'cultural', 'heritage']),
    ('Asian Fashion Aesthetics', 'Cultural Fashion', 'Asian fashion combines minimalist aesthetics with intricate details. From Japanese kimono-inspired designs to Korean hanbok fusion, Asian fashion emphasizes clean lines, quality fabrics, and thoughtful construction. Modern interpretations blend traditional elements with contemporary streetwear.', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500', 1, ARRAY['asian', 'cultural', 'minimalism']);

    INSERT INTO outfit_ideas (title, description, occasion, season, style_type, image_url, product_ids, created_by) VALUES
    ('Casual Weekend Look', 'Perfect for brunch or shopping with friends. Pair a classic white tee with slim jeans and white sneakers for an effortlessly cool vibe.', 'Casual', 'All Season', 'Streetwear', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500', ARRAY[1, 2, 10], 1),
    ('Business Casual Chic', 'Nail the office look with a silk blouse, midi skirt, and elegant accessories. Professional yet stylish.', 'Work', 'Spring/Fall', 'Professional', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500', ARRAY[7, 8], 1),
    ('Date Night Elegance', 'Turn heads with a leather jacket over a summer dress. Edgy meets feminine for the perfect date night ensemble.', 'Evening', 'All Season', 'Romantic', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500', ARRAY[5, 6], 1),
    ('Eco-Conscious Comfort', 'Sustainable style doesn''t mean sacrificing comfort. Organic cotton tee with hemp joggers and canvas sneakers.', 'Casual', 'All Season', 'Sustainable', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500', ARRAY[11, 13, 14], 1),
    ('Winter Layering Master', 'Stay warm and stylish with a wool coat over a hoodie and jeans. Perfect layering for cold days.', 'Casual', 'Winter', 'Layered', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500', ARRAY[3, 9, 2], 1);

    UPDATE products p SET 
      rating = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE product_id = p.id), 0),
      review_count = COALESCE((SELECT COUNT(*) FROM reviews WHERE product_id = p.id), 0);

    UPDATE designers d SET 
      rating = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM designer_reviews WHERE designer_id = d.id), 0),
      review_count = COALESCE((SELECT COUNT(*) FROM designer_reviews WHERE designer_id = d.id), 0);
  `);
  
  console.log('✓ Sample data loaded');
}

module.exports = initDatabase;
