import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  const mockProducts = [
    { name: 'Wireless Headphones', price: 79.99, description: 'Premium noise-canceling headphones', image: 'https://via.placeholder.com/300?text=Headphones' },
    { name: 'Smart Watch', price: 199.99, description: 'Feature-rich fitness tracking watch', image: 'https://via.placeholder.com/300?text=Smart+Watch' },
    { name: 'Laptop Stand', price: 49.99, description: 'Ergonomic aluminum laptop stand', image: 'https://via.placeholder.com/300?text=Laptop+Stand' },
    { name: 'Mechanical Keyboard', price: 129.99, description: 'RGB mechanical gaming keyboard', image: 'https://via.placeholder.com/300?text=Keyboard' },
    { name: 'USB-C Hub', price: 39.99, description: '7-in-1 USB-C adapter hub', image: 'https://via.placeholder.com/300?text=USB+Hub' },
    { name: 'Wireless Mouse', price: 34.99, description: 'Ergonomic wireless mouse', image: 'https://via.placeholder.com/300?text=Mouse' },
    { name: 'Monitor Stand', price: 59.99, description: 'Dual monitor stand with cable management', image: 'https://via.placeholder.com/300?text=Monitor+Stand' },
    { name: 'Webcam HD', price: 89.99, description: '1080p webcam with auto-focus', image: 'https://via.placeholder.com/300?text=Webcam' },
  ];

  try {
    const products = await Product.find({});
    // If DB is empty, seed once
    if (products.length === 0) {
      await Product.insertMany(mockProducts);
      const seededProducts = await Product.find({});
      return res.json(seededProducts);
    }
    return res.json(products);
  } catch (error) {
    // DB not available → serve mock products with synthetic ids so UI works
    console.error('DB unavailable, serving mock products:', error.message);
    const withIds = mockProducts.map((p, i) => ({ _id: `mock-${i + 1}`, ...p }));
    return res.json(withIds);
  }
});

export default router;

