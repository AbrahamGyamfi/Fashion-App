import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ProductCard.css';

const StarRating = ({ rating, count }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const starFill = (i) => {
    if (i <= full) return '#f59e0b';
    if (i === full + 1 && half) return '#f59e0b';
    return '#e5e7eb';
  };
  return (
    <div className="product-rating">
      <div className="stars-svg">
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1L8.545 5.09H13L9.545 7.6L10.91 12L7 9.27L3.09 12L4.455 7.6L1 5.09H5.455L7 1Z"
              fill={starFill(i)}
              stroke={i <= full || (i === full + 1 && half) ? '#f59e0b' : '#d1d5db'}
              strokeWidth="0.5"
            />
          </svg>
        ))}
      </div>
      {count > 0 && <span className="rating-count">({count})</span>}
    </div>
  );
};

function ProductCard({ product, onAddToCart, isWishlisted, onToggleWishlist }) {
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    onAddToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const cultureColors = {
    'African': '#e67e22',
    'Asian': '#8e44ad',
    'Middle Eastern': '#c0392b',
    'Latin American': '#27ae60',
    'Fusion': '#d4af37',
  };
  const cultureBg = cultureColors[product.culture_category];

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <div className="image-placeholder">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="8" fill="#e5e7eb" />
              <path d="M32 20L40 28H36V44H28V28H24L32 20Z" fill="#9ca3af" />
            </svg>
          </div>
        )}

        <div className="badges-top-left">
          {product.featured && <span className="badge badge-featured">Featured</span>}
          {cultureBg && (
            <span className="badge badge-culture" style={{ background: cultureBg }}>
              {product.culture_category}
            </span>
          )}
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <span className="badge badge-low-stock">Only {product.stock} left</span>
        )}
        {product.stock === 0 && (
          <span className="badge badge-out">Sold Out</span>
        )}

        <button
          className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleWishlist && onToggleWishlist(product.id); }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? '#e11d48' : 'none'} stroke={isWishlisted ? '#e11d48' : 'currentColor'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <div className="card-overlay">
          <button className="quick-view-btn">Quick View</button>
        </div>
      </div>

      <div className="product-info">
        {product.brand_name && (
          <div className="designer-info">
            <span className="designer-name">{product.brand_name}</span>
            {product.verified && (
              <span className="verified-badge" title="Verified Designer">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="6" fill="#10b981" />
                  <path d="M3.5 6L5.5 8L8.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
        )}

        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-details">
          {product.color && (
            <span className="detail-badge">
              <span className="color-dot" style={{ background: product.color.toLowerCase() }} />
              {product.color}
            </span>
          )}
          {product.size && <span className="detail-badge">Size {product.size}</span>}
        </div>

        <div className="product-footer">
          <div className="price-block">
            <span className="product-price">${Number.parseFloat(product.price).toFixed(2)}</span>
            {product.rating > 0 && <StarRating rating={product.rating} count={product.review_count} />}
          </div>
        </div>
      </div>

      <button
        className={`btn-add-cart ${addedToCart ? 'added' : ''}`}
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : addedToCart ? '✓ Added to Bag!' : 'Add to Bag'}
      </button>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image_url: PropTypes.string,
    stock: PropTypes.number,
    category: PropTypes.string,
    culture_category: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string,
    featured: PropTypes.bool,
    brand_name: PropTypes.string,
    verified: PropTypes.bool,
    rating: PropTypes.number,
    review_count: PropTypes.number,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  isWishlisted: PropTypes.bool,
  onToggleWishlist: PropTypes.func,
};

export default ProductCard;
