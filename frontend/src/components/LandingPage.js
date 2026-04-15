import React, { useState, useEffect } from 'react';
import './LandingPage.css';

function LandingPage({ onLogin, onRegister }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const fashionImages = [
    {
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      title: 'Latest Trends'
    },
    {
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
      title: 'Designer Collections'
    },
    {
      url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
      title: 'Street Style'
    },
    {
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      title: 'Elegant Fashion'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % fashionImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [fashionImages.length]);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="4" fill="#ffffff"/>
                <path d="M16 6L22 12L20 12L20 20L12 20L12 12L10 12L16 6Z" fill="#000000"/>
                <rect x="8" y="24" width="16" height="2" fill="#000000"/>
              </svg>
              <span className="logo-text">ShopNow</span>
            </div>
            <nav className="landing-nav">
              <a href="#features" className="nav-link">Features</a>
              <a href="#designers" className="nav-link">Designers</a>
              <a href="#learn" className="nav-link">Learn Fashion</a>
              <button className="btn-try-free" onClick={onLogin}>Try for Free</button>
            </nav>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-carousel">
          {fashionImages.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image.url})` }}
            />
          ))}
          <div className="carousel-overlay" />
        </div>
        
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Fashion
              <br />
              <span className="gradient-text">That Defines You</span>
            </h1>
            <p className="hero-subtitle">
              Explore curated collections from top designers, learn styling tips,
              <br />
              and shop the latest trends in one seamless experience.
            </p>
            <div className="hero-actions">
              <button className="btn-signup" onClick={onRegister}>
                Start Shopping
              </button>
              <button className="btn-secondary-hero" onClick={onLogin}>
                Sign In
              </button>
            </div>
          </div>
          
          <div className="carousel-indicators">
            {fashionImages.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="culture-section" id="collections">
        <div className="container">
          <h2 className="section-title">Shop by Culture</h2>
          <p className="section-subtitle">Explore fashion from diverse cultural traditions around the world</p>
          <div className="culture-grid">
            <div className="culture-card" onClick={() => onLogin()}>
              <div className="culture-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80)' }}>
                <div className="culture-overlay" />
              </div>
              <div className="culture-content">
                <h3>African Fashion</h3>
                <p>Vibrant prints, bold patterns, and rich cultural heritage</p>
                <span className="culture-tag">Ankara • Kente • Dashiki • Agbada</span>
              </div>
            </div>

            <div className="culture-card" onClick={() => onLogin()}>
              <div className="culture-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80)' }}>
                <div className="culture-overlay" />
              </div>
              <div className="culture-content">
                <h3>Western Fashion</h3>
                <p>Contemporary styles, streetwear, and timeless elegance</p>
                <span className="culture-tag">Casual • Formal • Streetwear • Luxury</span>
              </div>
            </div>

            <div className="culture-card" onClick={() => onLogin()}>
              <div className="culture-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80)' }}>
                <div className="culture-overlay" />
              </div>
              <div className="culture-content">
                <h3>Asian Fashion</h3>
                <p>Minimalist aesthetics, traditional fusion, and modern innovation</p>
                <span className="culture-tag">Kimono • Hanbok • Contemporary</span>
              </div>
            </div>

            <div className="culture-card" onClick={() => onLogin()}>
              <div className="culture-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1583008957836-d5c5a6c3c6e9?w=600&q=80)' }}>
                <div className="culture-overlay" />
              </div>
              <div className="culture-content">
                <h3>Middle Eastern Fashion</h3>
                <p>Elegant modest wear, luxurious fabrics, and intricate details</p>
                <span className="culture-tag">Kaftan • Abaya • Modest Wear</span>
              </div>
            </div>

            <div className="culture-card" onClick={() => onLogin()}>
              <div className="culture-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600&q=80)' }}>
                <div className="culture-overlay" />
              </div>
              <div className="culture-content">
                <h3>Latin American Fashion</h3>
                <p>Vibrant colors, traditional textiles, and festive designs</p>
                <span className="culture-tag">Embroidery • Patterns • Colorful</span>
              </div>
            </div>

            <div className="culture-card" onClick={() => onLogin()}>
              <div className="culture-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80)' }}>
                <div className="culture-overlay" />
              </div>
              <div className="culture-content">
                <h3>Fusion & Contemporary</h3>
                <p>Cross-cultural designs blending global fashion traditions</p>
                <span className="culture-tag">Modern • Eclectic • Global</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="container">
          <h2 className="section-title">Why Choose ShopNow</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Multi-Vendor Marketplace</h3>
              <p>Shop from multiple verified designers and brands in one place</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Curated Collections</h3>
              <p>Handpicked fashion items from trending designers worldwide</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Fashion Learning Hub</h3>
              <p>Master styling with expert guides, trends, and outfit inspiration</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Style?</h2>
            <p>Join thousands of fashion enthusiasts shopping smarter</p>
            <button className="btn-cta" onClick={onRegister}>
              Get Started Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
