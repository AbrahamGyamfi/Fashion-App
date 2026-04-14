import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Designers.css';

function Designers() {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    try {
      const response = await axios.get('/api/designers');
      setDesigners(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionBadge = (tier) => {
    const badges = {
      basic: { label: 'Basic', class: 'basic' },
      premium: { label: 'Premium', class: 'premium' },
      enterprise: { label: 'Enterprise', class: 'enterprise' }
    };
    return badges[tier] || badges.basic;
  };

  if (loading) {
    return <div className="loading">Loading designers...</div>;
  }

  return (
    <div className="designers-page">
      <div className="page-header">
        <h1 className="page-title">Designers</h1>
        <button className="btn-add">+ Add Designer</button>
      </div>

      <div className="designers-grid">
        {designers.map(designer => {
          const badge = getSubscriptionBadge(designer.subscription_tier);
          return (
            <div key={designer.id} className="designer-card">
              <div className="designer-header">
                {designer.logo_url ? (
                  <img src={designer.logo_url} alt={designer.brand_name} className="designer-logo" />
                ) : (
                  <div className="designer-logo-placeholder">
                    {designer.brand_name.charAt(0)}
                  </div>
                )}
                <div className="designer-badges">
                  {designer.verified && (
                    <span className="verified-badge" title="Verified">✓</span>
                  )}
                  <span className={`subscription-badge ${badge.class}`}>
                    {badge.label}
                  </span>
                </div>
              </div>

              <div className="designer-info">
                <h3>{designer.brand_name}</h3>
                {designer.description && (
                  <p className="designer-description">{designer.description}</p>
                )}
                
                <div className="designer-stats">
                  <div className="stat">
                    <span className="stat-label">Products</span>
                    <span className="stat-value">{designer.product_count || 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Sales</span>
                    <span className="stat-value">${parseFloat(designer.total_sales || 0).toFixed(2)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Commission</span>
                    <span className="stat-value">{designer.commission_rate}%</span>
                  </div>
                </div>

                <div className="designer-meta">
                  <span className="meta-item">
                    Status: <strong className={designer.subscription_status === 'active' ? 'active' : 'inactive'}>
                      {designer.subscription_status}
                    </strong>
                  </span>
                  {designer.rating > 0 && (
                    <span className="meta-item">
                      Rating: <strong>⭐ {designer.rating.toFixed(1)}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="designer-actions">
                <button className="btn-view">View Products</button>
                <button className="btn-edit">Edit</button>
              </div>
            </div>
          );
        })}
      </div>

      {designers.length === 0 && (
        <div className="empty-state">
          <h3>No designers yet</h3>
          <p>Add your first designer to get started</p>
        </div>
      )}
    </div>
  );
}

export default Designers;
