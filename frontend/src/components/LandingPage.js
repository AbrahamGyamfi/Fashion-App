import React from 'react';
import './LandingPage.css';

function LandingPage({ onLogin, onRegister }) {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="landing-content">
          <h1>ShopNow Fashion</h1>
          <p>Discover the latest trends from top designers</p>
          <div className="landing-buttons">
            <button className="btn-primary" onClick={onLogin}>Login</button>
            <button className="btn-secondary" onClick={onRegister}>Sign Up</button>
          </div>
        </div>
      </div>

      <div className="landing-features">
        <div className="feature">
          <span className="feature-icon">👔</span>
          <h3>Designer Brands</h3>
          <p>Shop from verified fashion designers</p>
        </div>
        <div className="feature">
          <span className="feature-icon">⭐</span>
          <h3>Quality Products</h3>
          <p>Curated collection of premium items</p>
        </div>
        <div className="feature">
          <span className="feature-icon">🚚</span>
          <h3>Fast Delivery</h3>
          <p>Quick and reliable shipping</p>
        </div>
      </div>

      <div className="landing-preview">
        <h2>Featured Collections</h2>
        <div className="preview-grid">
          <div className="preview-card">
            <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300" alt="Fashion" />
            <h4>Streetwear</h4>
          </div>
          <div className="preview-card">
            <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300" alt="Fashion" />
            <h4>Elegant Dresses</h4>
          </div>
          <div className="preview-card">
            <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300" alt="Fashion" />
            <h4>Footwear</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
