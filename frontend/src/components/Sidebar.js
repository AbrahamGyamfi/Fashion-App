import React from 'react';
import './Sidebar.css';

function Sidebar({ currentPage, onNavigate, onBackToStore }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'designers', label: 'Designers', icon: '👔' },
    { id: 'orders', label: 'Orders', icon: '🛒' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>ShopNow Admin</h1>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item" onClick={onBackToStore}>
          <span className="nav-icon">🏪</span>
          <span className="nav-label">Back to Store</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
