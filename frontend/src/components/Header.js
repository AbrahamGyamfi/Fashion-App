import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

function Header({ onCartClick, onAdminClick, onLogout, onLearnClick, onWishlistClick, user, cartCount, wishlistCount, currentView }) {
  const isAdmin = user?.email === 'gyamfiabraham95@gmail.com';

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="4" fill="#000000" />
              <path d="M16 6L22 12L20 12L20 20L12 20L12 12L10 12L16 6Z" fill="white" />
              <rect x="8" y="24" width="16" height="2" fill="white" />
            </svg>
            <div>
              <h1>ShopNow</h1>
              <span className="tagline">Fashion</span>
            </div>
          </div>

          <nav className="nav">
            <button
              className={`nav-link ${currentView === 'shop' ? 'active' : ''}`}
              onClick={() => window.location.reload()} // NOSONAR
            >
              Shop
            </button>
            <button
              className={`nav-link ${currentView === 'learn' ? 'active' : ''}`}
              onClick={onLearnClick}
            >
              Style Guide
            </button>

            <span className="nav-divider" />

            <span className="user-greeting">Hi, {user?.first_name || 'You'}</span>

            {/* Wishlist */}
            <button className="icon-btn wishlist-icon-btn" onClick={onWishlistClick} aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && <span className="icon-badge wishlist-badge">{wishlistCount}</span>}
            </button>

            {/* Cart */}
            <button className="icon-btn cart-btn" onClick={onCartClick} aria-label="Shopping bag">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinejoin="round" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && <span className="icon-badge cart-badge">{cartCount}</span>}
            </button>

            {isAdmin && (
              <button className="btn-admin" onClick={onAdminClick}>Admin</button>
            )}

            <button className="btn-logout" onClick={onLogout}>Logout</button>
          </nav>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  onCartClick: PropTypes.func.isRequired,
  onAdminClick: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onLearnClick: PropTypes.func.isRequired,
  onWishlistClick: PropTypes.func,
  user: PropTypes.shape({
    email: PropTypes.string,
    first_name: PropTypes.string,
    user_type: PropTypes.string,
  }).isRequired,
  cartCount: PropTypes.number,
  wishlistCount: PropTypes.number,
  currentView: PropTypes.string,
};

export default Header;
