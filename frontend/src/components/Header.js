import React from 'react';
import './Header.css';

function Header({ onCartClick, onAdminClick, onLogout, onLearnClick, user, cartCount, currentView }) {
  console.log('Header user:', user);
  const isAdmin = user?.email === 'gyamfiabraham95@gmail.com';
  const isVendor = user?.user_type === 'vendor';
  const isBuyer = user?.user_type === 'buyer';
  
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="4" fill="#000000"/>
              <path d="M16 6L22 12L20 12L20 20L12 20L12 12L10 12L16 6Z" fill="white"/>
              <rect x="8" y="24" width="16" height="2" fill="white"/>
            </svg>
            <div>
              <h1>ShopNow</h1>
              <span className="tagline">Fashion</span>
            </div>
          </div>
          
          <nav className="nav">
            <button className={`nav-link ${currentView === 'shop' ? 'active' : ''}`} onClick={() => window.location.reload()}>Shop</button>
            <button className={`nav-link ${currentView === 'learn' ? 'active' : ''}`} onClick={onLearnClick}>Learn</button>
            <span className="user-name">Hi, {user?.first_name || 'User'}</span>
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="icon-btn cart-btn" onClick={onCartClick}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 3H4.5L6.5 13H16.5L18.5 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="7" cy="17" r="1" fill="currentColor"/>
                <circle cx="16" cy="17" r="1" fill="currentColor"/>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            {isAdmin && (
              <button className="btn-primary" onClick={onAdminClick}>
                Admin
              </button>
            )}
            <button className="btn-secondary" onClick={onLogout}>
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
