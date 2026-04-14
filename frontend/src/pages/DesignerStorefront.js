import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './DesignerStorefront.css';

function DesignerStorefront({ onAddToCart }) {
  const { id } = useParams();
  const [designer, setDesigner] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesignerData();
  }, [id]);

  const fetchDesignerData = async () => {
    try {
      const [designerRes, productsRes, reviewsRes] = await Promise.all([
        axios.get(`/api/designers/${id}`),
        axios.get(`/api/designers/${id}/products`),
        axios.get(`/api/designers/${id}/reviews`)
      ]);
      
      setDesigner(designerRes.data);
      setProducts(productsRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading designer store...</div>;
  }

  if (!designer) {
    return <div className="error">Designer not found</div>;
  }

  return (
    <div className="designer-storefront">
      {/* Cover Image */}
      <div className="designer-cover" style={{
        backgroundImage: designer.cover_image_url ? `url(${designer.cover_image_url})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="cover-overlay">
          <div className="designer-header-content">
            {designer.logo_url ? (
              <img src={designer.logo_url} alt={designer.brand_name} className="designer-logo-large" />
            ) : (
              <div className="designer-logo-placeholder-large">
                {designer.brand_name.charAt(0)}
              </div>
            )}
            <div className="designer-title">
              <h1>{designer.brand_name}</h1>
              {designer.verified && <span className="verified-badge-large">✓ Verified</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Designer Info */}
      <div className="designer-info-section">
        <div className="container">
          <div className="designer-stats-bar">
            <div className="stat-item">
              <span className="stat-value">{products.length}</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">⭐ {designer.rating.toFixed(1)}</span>
              <span className="stat-label">{designer.review_count} Reviews</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{designer.subscription_tier}</span>
              <span className="stat-label">Tier</span>
            </div>
          </div>

          {designer.description && (
            <div className="designer-about">
              <h2>About {designer.brand_name}</h2>
              <p>{designer.description}</p>
            </div>
          )}

          {(designer.website_url || designer.instagram_url || designer.facebook_url) && (
            <div className="designer-social">
              {designer.website_url && (
                <a href={designer.website_url} target="_blank" rel="noopener noreferrer" className="social-link">
                  🌐 Website
                </a>
              )}
              {designer.instagram_url && (
                <a href={designer.instagram_url} target="_blank" rel="noopener noreferrer" className="social-link">
                  📷 Instagram
                </a>
              )}
              {designer.facebook_url && (
                <a href={designer.facebook_url} target="_blank" rel="noopener noreferrer" className="social-link">
                  👥 Facebook
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="designer-products-section">
        <div className="container">
          <h2>Products by {designer.brand_name}</h2>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
          {products.length === 0 && (
            <div className="empty-state">
              <p>No products available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="designer-reviews-section">
          <div className="container">
            <h2>Customer Reviews</h2>
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      {review.avatar_url ? (
                        <img src={review.avatar_url} alt={review.first_name} className="reviewer-avatar" />
                      ) : (
                        <div className="reviewer-avatar-placeholder">
                          {review.first_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <strong>{review.first_name} {review.last_name}</strong>
                        <div className="review-rating">
                          {'⭐'.repeat(review.rating)}
                        </div>
                      </div>
                    </div>
                    <span className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DesignerStorefront;
