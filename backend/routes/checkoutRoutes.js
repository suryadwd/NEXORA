import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// In-memory cart reference (same as cartRoutes)
// In a real app, this would be stored per user/session
let cartItems = [];

// POST /api/checkout - Process checkout and return receipt
router.post('/', async (req, res) => {
  try {
    const { cartItems: items, name, email } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Calculate totals
    let total = 0;
    const receiptItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        const subtotal = product.price * item.quantity;
        total += subtotal;
        return {
          name: product.name,
          quantity: item.quantity,
          price: product.price,
          subtotal: subtotal.toFixed(2),
        };
      })
    );

    const receipt = {
      orderId: `ORD-${Date.now()}`,
      customer: {
        name,
        email,
      },
      items: receiptItems,
      total: total.toFixed(2),
      tax: (total * 0.08).toFixed(2), // 8% tax
      grandTotal: (total * 1.08).toFixed(2),
      timestamp: new Date().toISOString(),
      status: 'completed',
    };

    // Clear cart after checkout
    cartItems = [];

    res.status(200).json(receipt);
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

export default router;

