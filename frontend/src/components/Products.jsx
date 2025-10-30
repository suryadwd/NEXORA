import React from 'react';
import './Products.css';

function Products({ products, onAddToCart }) {
  return (
    <div className="products-section">
      <h2>Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              <img 
                src={product.image || 'https://via.placeholder.com/300?text=Product'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300?text=Product';
                }}
              />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">${product.price.toFixed(2)}</span>
                <button
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(product._id, 1)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;

