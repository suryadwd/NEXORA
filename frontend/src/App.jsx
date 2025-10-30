import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Products from './components/Products';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import './App.css';

const API_BASE_URL = '/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart`);
      setCart(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(`${API_BASE_URL}/cart`, {
        productId,
        qty: quantity,
      });
      await fetchCart();
      setError(null);
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/cart/${itemId}`);
      await fetchCart();
      setError(null);
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await axios.put(`${API_BASE_URL}/cart/${itemId}`, {
        quantity,
      });
      await fetchCart();
      setError(null);
    } catch (err) {
      setError('Failed to update cart');
      console.error('Error updating cart:', err);
    }
  };

  const handleCheckout = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/checkout`, {
        cartItems: cart.items,
        ...formData,
      });
      setReceipt(response.data); // save receipt for slip
      setShowCheckout(false); // close checkout modal
      await fetchCart(); // Clear cart
      setError(null);
    } catch (err) {
      setError('Failed to process checkout');
      console.error('Error during checkout:', err);
    }
  };

  const closeReceipt = () => {
    setReceipt(null);
  };

  const openSlipWindow = (data) => {
    const w = window.open('', '_blank');
    if (!w) return;
    const styles = `
      body{font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin:0;padding:24px;color:#333}
      .slip{max-width:720px;margin:0 auto}
      h1{margin:0 0 12px 0}
      .meta{margin:4px 0}
      .items{margin:12px 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5}
      .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f1f1}
      .row:last-child{border-bottom:0}
      .totals{margin-top:12px;font-weight:600}
      .grand{font-size:18px;color:#4f46e5}
      button{padding:10px 14px;border-radius:8px;border:1px solid #e5e5e5;background:#fff;cursor:pointer}
    `;
    const html = `<!doctype html><html><head><meta charset="utf-8" /><title>Slip</title><style>${styles}</style></head><body>
      <div class="slip">
        <h1>Order Slip</h1>
        ${data.orderId ? `<div class="meta"><strong>Order ID:</strong> ${data.orderId}</div>` : ''}
        ${data.customer ? `<div class="meta"><strong>Customer:</strong> ${data.customer.name}</div>` : ''}
        ${data.customer ? `<div class="meta"><strong>Email:</strong> ${data.customer.email}</div>` : ''}
        ${!data.customer ? `<div class="meta"><strong>Preview:</strong> Not yet checked out</div>` : ''}
        <div class="items">
          ${(data.items || []).map(i => `<div class=\"row\"><span>${i.name} × ${i.quantity}</span><span>$${(i.subtotal || (i.price * i.quantity).toFixed(2))}</span></div>`).join('')}
        </div>
        <div class="totals">
          <div>Subtotal: $${data.total}</div>
          <div>Tax: $${data.tax || '0.00'}</div>
          <div class="grand">Total: $${data.grandTotal || data.total}</div>
        </div>
        <div class="meta">Date: ${data.timestamp ? new Date(data.timestamp).toLocaleString() : new Date().toLocaleString()}</div>
      </div>
    </body></html>`;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  const handleViewSlip = () => {
    if (!receipt) return; // only available after checkout
    openSlipWindow(receipt);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🛍️ Vibe Commerce</h1>
        <div className="header-cart-info">
          <span>Cart ({cart.itemCount})</span>
        </div>
      </header>

      {error && (
        <div className="error-banner" onClick={() => setError(null)}>
          {error} <span className="close">×</span>
        </div>
      )}

      <main className="main-content">
        <div className="content-wrapper">
          <Products
            products={products}
            onAddToCart={handleAddToCart}
          />
          
          <Cart
            cart={cart}
            onRemove={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onCheckout={() => setShowCheckout(true)}
            onViewSlip={handleViewSlip}
            canViewSlip={!!receipt}
          />
        </div>
      </main>

      {showCheckout && (
        <Checkout
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onSubmit={handleCheckout}
        />
      )}
    </div>
  );
}

export default App;

