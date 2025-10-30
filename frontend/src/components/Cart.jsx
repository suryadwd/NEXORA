import React from 'react';
import './Cart.css';

function Cart({ cart, onRemove, onUpdateQuantity, onCheckout, onViewSlip, canViewSlip }) {
  if (cart.items.length === 0) {
    return (
      <div className="cart-section">
        <h2>Cart</h2>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <span>🛒</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-section">
      <h2>Cart ({cart.itemCount} items)</h2>
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img 
                src={item.image || 'https://via.placeholder.com/80?text=Product'} 
                alt={item.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80?text=Product';
                }}
              />
            </div>
            <div className="cart-item-details">
              <h4 className="cart-item-name">{item.name}</h4>
              <p className="cart-item-price">${item.price}</p>
              <div className="cart-item-controls">
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                >
                  −
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="remove-btn"
                  onClick={() => onRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="cart-item-subtotal">
              ${item.subtotal}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span className="total-amount">${cart.total}</span>
        </div>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <button className="checkout-btn" onClick={onCheckout}>
            Proceed to Checkout
          </button>
          {canViewSlip && (
            <button
              className="checkout-btn"
              onClick={onViewSlip}
              style={{
                background: '#ffffff',
                color: '#333',
                border: '2px solid #e0e0e0',
              }}
            >
              View Slip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;

