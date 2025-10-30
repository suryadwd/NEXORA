import express from 'express';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';

const router = express.Router();

// In-memory cart for demo (can be replaced with user-based cart in DB)
let cartItems = [];

// GET /api/cart - Get cart items with total
router.get('/', async (req, res) => {
  try {
    let total = 0;
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          return null;
        }
        const subtotal = product.price * item.quantity;
        total += subtotal;
        return {
          id: item.id,
          productId: item.productId,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          subtotal: subtotal.toFixed(2),
          image: product.image,
        };
      })
    );

    const validItems = itemsWithDetails.filter(item => item !== null);

    res.json({
      items: validItems,
      total: total.toFixed(2),
      itemCount: validItems.length,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, qty } = req.body;

    if (!productId || !qty || qty < 1) {
      return res.status(400).json({ error: 'Invalid productId or quantity' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    const existingItemIndex = cartItems.findIndex(
      item => item.productId === productId.toString()
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cartItems[existingItemIndex].quantity += parseInt(qty);
    } else {
      // Add new item
      cartItems.push({
        id: Date.now().toString(),
        productId: productId.toString(),
        quantity: parseInt(qty),
      });
    }

    res.status(201).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = cartItems.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItems.splice(index, 1);
    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// PUT /api/cart/:id - Update item quantity
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const item = cartItems.find(item => item.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    item.quantity = parseInt(quantity);
    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

export default router;

