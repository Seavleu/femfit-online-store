const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images category')
      .lean();

    if (!cart) {
      return res.json({ cart: { items: [], totalItems: 0 } });
    }

    // Calculate totals
    let totalUSD = 0;
    let totalKHR = 0;

    cart.items.forEach(item => {
      if (item.product) {
        totalUSD += item.product.price.usd * item.quantity;
        totalKHR += item.product.price.khr * item.quantity;
      }
    });

    res.json({
      cart: {
        ...cart,
        totals: {
          usd: totalUSD,
          khr: totalKHR
        }
      }
    });
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1, selectedSize, selectedColor } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Verify product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check stock availability
    if (product.totalStock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        selectedSize,
        selectedColor
      });
    }

    await cart.save();

    // Populate and return updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price images category')
      .lean();

    res.json({
      message: 'Item added to cart',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/update/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Check stock availability
    const product = await Product.findById(item.product);
    if (product.totalStock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price images category')
      .lean();

    res.json({
      message: 'Cart updated successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Cart update error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items.pull({ _id: itemId });
    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price images category')
      .lean();

    res.json({
      message: 'Item removed from cart',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Cart item removal error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear entire cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true }
    );

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Cart clear error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;