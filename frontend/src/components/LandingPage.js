import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './LandingPage.css';

const STATS = [
  { value: '3+',   label: 'Verified Designers' },
  { value: '16+',  label: 'Curated Products' },
  { value: '6',    label: 'World Cultures' },
  { value: '100%', label: 'Authentic Fashion' },
];

function LandingPage({ onLogin, onRegister }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const fashionImages = [
    { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80', label: 'Latest Trends' },
    { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80', label: 'Designer Collections' },
    { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80', label: 'Street Style' },
    { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80', label: 'African Heritage' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % fashionImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [fashionImages.length]);

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="lp-header-content">
            <div className="logo">
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="4" fill="#fff" />
                <path d="M16 6L22 12L20 12L20 20L12 20L12 12L10 12L16 6Z" fill="#000" />
                <rect x="8" y="24" width="16" height="2" fill="#000" />
              </svg>
              <span className="logo-text">ShopNow</span>
            </div>
            <nav className="landing-nav">
              <a href="#features" className="lp-nav-link">Features</a>
              <a href="#collections" className="lp-nav-link">Collections</a>
              <a href="#learn" className="lp-nav-link">Style Guide</a>
              <button className="btn-sign-in" onClick={onLogin}>Sign In</button>
              <button className="btn-try-free" onClick={onRegister}>Start Shopping</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-carousel">
          {fashionImages.map((img, i) => (
            <div
              key={i}
              className={`carousel-slide ${i === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img.url})` }}
            />
          ))}
          <div className="carousel-overlay" />
        </div>

        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-eyebrow">Multi-Cultural Fashion Platform</span>
            <h1 className="hero-title">
              Discover Fashion
              <br />
              <span className="gradient-text">That Defines You</span>
            </h1>
            <p className="hero-subtitle">
              Curated collections from verified designers across 6 world cultures —
              shop, learn, and express your unique identity.
            </p>
            <div className="hero-actions">
              <button className="btn-signup" onClick={onRegister}>Start Shopping Free</button>
              <button className="btn-secondary-hero" onClick={onLogin}>Sign In →</button>
            </div>
          </div>

          <div className="carousel-indicators">
            {fashionImages.map((img, i) => (
              <button
                key={i}
                className={`indicator ${i === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
                aria-label={img.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="stats-strip">
        {STATS.map((s, i) => (
          <div key={i} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Culture grid */}
      <section className="culture-section" id="collections">
        <div className="container">
          <p className="section-eyebrow">Global Collections</p>
          <h2 className="section-title">Shop by Culture</h2>
          <p className="section-subtitle">Fashion that honours heritage and celebrates the world's diversity</p>
          <div className="culture-grid">
            {[
              { title: 'African Fashion', sub: 'Vibrant prints · Kente · Ankara · Dashiki', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80' },
              { title: 'Western Classic', sub: 'Contemporary · Streetwear · Luxury · Tailored', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80' },
              { title: 'Asian Aesthetic', sub: 'Minimalist · Kimono-inspired · Hanbok Fusion', img: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80' },
              { title: 'Middle Eastern', sub: 'Elegant Modest Wear · Kaftan · Luxury Fabrics', img: 'https://images.unsplash.com/photo-1583008957836-d5c5a6c3c6e9?w=600&q=80' },
              { title: 'Latin American', sub: 'Vibrant colours · Traditional textiles · Bold prints', img: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600&q=80' },
              { title: 'Eco Fusion', sub: 'Sustainable · Cross-cultural · Conscious Fashion', img: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&q=80' },
            ].map((col, i) => (
              <button key={i} className="culture-card" onClick={onLogin}>
                <div className="culture-image" style={{ backgroundImage: `url(${col.img})` }}>
                  <div className="culture-overlay" />
                </div>
                <div className="culture-content">
                  <h3>{col.title}</h3>
                  <p>{col.sub}</p>
                  <span className="culture-cta">Explore →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="container">
          <p className="section-eyebrow">Platform Features</p>
          <h2 className="section-title">Why ShopNow?</h2>
          <div className="features-grid">
            {[
              {
                icon: <path d="M3 9L12 2L21 9V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
                title: 'Multi-Vendor Marketplace',
                desc: 'Shop verified designers and independent brands — all in one seamless experience.',
              },
              {
                icon: <><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>,
                title: 'Curated Collections',
                desc: 'Handpicked fashion across 6 world cultures — African, Western, Asian and beyond.',
              },
              {
                icon: <><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" /></>,
                title: 'Fashion Learning Hub',
                desc: 'Master styling with expert guides, colour theory, outfit ideas and trend reports.',
              },
              {
                icon: <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>,
                title: 'Wishlist & Saves',
                desc: 'Save pieces you love and revisit them anytime — never lose track of a great find.',
              },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {f.icon}
                  </svg>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <p className="cta-eyebrow">Join the Community</p>
            <h2>Ready to Find Your Style?</h2>
            <p>Thousands of fashion pieces. Dozens of designers. One platform.</p>
            <div className="cta-actions">
              <button className="btn-cta" onClick={onRegister}>Start Shopping — It's Free</button>
              <button className="btn-cta-secondary" onClick={onLogin}>Already have an account?</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

LandingPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
};

export default LandingPage;
