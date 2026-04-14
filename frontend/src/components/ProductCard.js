import React from 'react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const stockStatus = product.stock > 20 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
  const stockText = product.stock > 20 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock';

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="image-placeholder">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="8" fill="#e5e7eb"/>
              <path d="M32 20L40 28H36V44H28V28H24L32 20Z" fill="#9ca3af"/>
            </svg>
          </div>
        )}
        <span className={`stock-badge ${stockStatus}`}>{stockText}</span>
        {product.featured && <span className="featured-badge">Featured</span>}
        <button className="quick-view">Quick View</button>
      </div>
      
      <div className="product-info">
        {product.brand_name && (
          <div className="designer-info">
            <span className="designer-name">{product.brand_name}</span>
            {product.verified && <span className="verified-badge" title="Verified Designer">✓</span>}
          </div>
        )}
        {product.category && <span className="product-category">{product.category}</span>}
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-details">
          {product.color && (
            <span className="detail-badge">
              <span className="color-dot" style={{background: product.color.toLowerCase()}}></span>
              {product.color}
            </span>
          )}
          {product.size && (
            <span className="detail-badge">Size: {product.size}</span>
          )}
        </div>
        
        <div className="product-footer">
          <div className="price-rating">
            <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
            {product.rating > 0 && (
              <div className="product-rating">
                <span className="stars">{'⭐'.repeat(Math.round(product.rating))}</span>
                <span className="rating-text">({product.review_count})</span>
              </div>
            )}
          </div>
          <span className="product-stock">{product.stock} left</span>
        </div>
      </div>
      
      <button 
        className="btn-add-cart" 
        onClick={() => onAddToCart(product)}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default ProductCard;
