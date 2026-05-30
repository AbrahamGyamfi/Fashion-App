import React from 'react';
import PropTypes from 'prop-types';
import './Cart.css';

const FREE_SHIPPING_THRESHOLD = 100;

function Cart({ items, onClose, onUpdateQuantity, onRemove, total }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="cart-overlay" onClick={onClose} role="presentation" onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Shopping cart">

        <div className="cart-header">
          <div className="cart-header-left">
            <h2>Your Bag</h2>
            {itemCount > 0 && <span className="cart-item-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>}
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Free shipping bar */}
        {items.length > 0 && (
          <div className="shipping-bar">
            {remaining > 0 ? (
              <p className="shipping-msg">
                Add <strong>${remaining.toFixed(2)}</strong> more for <span className="free-label">FREE shipping</span>
              </p>
            ) : (
              <p className="shipping-msg shipping-unlocked">
                🎉 You've unlocked <strong>FREE shipping!</strong>
              </p>
            )}
            <div className="shipping-progress-track">
              <div className="shipping-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" stroke="#e5e7eb" strokeWidth="2" />
                <path d="M24 30H56L53 52H27L24 30Z" stroke="#d1d5db" strokeWidth="2" fill="none" strokeLinejoin="round" />
                <circle cx="32" cy="58" r="3" fill="#d1d5db" />
                <circle cx="48" cy="58" r="3" fill="#d1d5db" />
                <path d="M34 36l-2 10M40 35v10M46 36l2 10" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="empty-title">Your bag is empty</p>
              <p className="empty-sub">Add items to start shopping</p>
              <button className="btn-continue-shopping" onClick={onClose}>Continue Shopping</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120'}
                    alt={item.name}
                  />
                </div>
                <div className="item-details">
                  {item.brand_name && <span className="item-brand">{item.brand_name}</span>}
                  <h4 className="item-name">{item.name}</h4>
                  <div className="item-meta-row">
                    {item.size && <span className="item-meta">Size: {item.size}</span>}
                    {item.color && <span className="item-meta">{item.color}</span>}
                  </div>
                  <div className="item-bottom">
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease"
                      >−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase"
                      >+</button>
                    </div>
                    <button className="remove-btn" onClick={() => onRemove(item.id)}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="item-price-col">
                  <span className="item-total">${(Number.parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  {item.quantity > 1 && (
                    <span className="item-unit-price">${Number.parseFloat(item.price).toFixed(2)} each</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={total >= FREE_SHIPPING_THRESHOLD ? 'free-shipping-text' : ''}>
                  {total >= FREE_SHIPPING_THRESHOLD ? 'FREE' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button className="checkout-btn">
              Checkout · ${total.toFixed(2)}
            </button>
            <button className="btn-continue-shopping secondary" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Cart.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quantity: PropTypes.number,
    image_url: PropTypes.string,
    brand_name: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

export default Cart;
