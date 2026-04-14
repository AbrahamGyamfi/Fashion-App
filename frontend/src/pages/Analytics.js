import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Analytics.css';

function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [productsRes, statsRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/stats')
      ]);
      
      const products = productsRes.data;
      const categoryBreakdown = {};
      
      products.forEach(p => {
        if (!categoryBreakdown[p.category]) {
          categoryBreakdown[p.category] = { count: 0, value: 0 };
        }
        categoryBreakdown[p.category].count++;
        categoryBreakdown[p.category].value += p.price * p.stock;
      });

      setStats({
        totalRevenue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
        avgPrice: products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length,
        totalStock: products.reduce((sum, p) => sum + p.stock, 0),
        categoryBreakdown
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics-page">
      <h1 className="page-title">Analytics & Reports</h1>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Inventory Value</h3>
          <p className="big-number">${stats.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="analytics-card">
          <h3>Average Product Price</h3>
          <p className="big-number">${stats.avgPrice.toFixed(2)}</p>
        </div>

        <div className="analytics-card">
          <h3>Total Stock Units</h3>
          <p className="big-number">{stats.totalStock}</p>
        </div>
      </div>

      <div className="category-breakdown">
        <h2>Category Breakdown</h2>
        <div className="category-grid">
          {Object.entries(stats.categoryBreakdown).map(([category, data]) => (
            <div key={category} className="category-card">
              <h4>{category}</h4>
              <div className="category-stats">
                <div>
                  <span className="label">Products:</span>
                  <span className="value">{data.count}</span>
                </div>
                <div>
                  <span className="label">Value:</span>
                  <span className="value">${data.value.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-box">
        <p>📊 Advanced analytics and reporting features coming soon.</p>
      </div>
    </div>
  );
}

export default Analytics;
