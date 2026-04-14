import React from 'react';
import './Cart.css';

function Cart({ items, onClose, onUpdateQuantity, onRemove, total }) {
  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart ({items.length})</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 24H44L42 40H22L20 24Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="26" cy="46" r="2" fill="currentColor"/>
                <circle cx="38" cy="46" r="2" fill="currentColor"/>
              </svg>
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image_url || 'https://via.placeholder.com/80'} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-price">${parseFloat(item.price).toFixed(2)}</p>
                  {item.size && <span className="item-meta">Size: {item.size}</span>}
                  {item.color && <span className="item-meta">Color: {item.color}</span>}
                </div>
                <div className="item-actions">
                  <div className="quantity-control">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => onRemove(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-amount">${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
