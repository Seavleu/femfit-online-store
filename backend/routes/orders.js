const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { sendOrderConfirmationEmail, sendTelegramNotification } = require('../utils/notifications');

const router = express.Router();

// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'name images')
      .lean();

    const total = await Order.countDocuments({ user: req.user._id });

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images category')
      .populate('user', 'name email')
      .lean();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order from cart
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { 
      shippingAddress, 
      paymentMethod, 
      currency = 'USD',
      promoCode 
    } = req.body;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street) {
      return res.status(400).json({ error: 'Complete shipping address is required' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        return res.status(400).json({ error: `Product ${item.product?.name || 'unknown'} is no longer available` });
      }
      if (item.product.totalStock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${item.product.name}` });
      }
    }

    // Calculate totals
    const currencyKey = currency.toLowerCase();
    let subtotal = 0;

    const orderItems = cart.items.map(item => {
      const unitPrice = item.product.price[currencyKey];
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      return {
        product: item.product._id,
        productSnapshot: {
          name: item.product.name,
          price: item.product.price,
          image: item.product.primaryImage?.url || item.product.images[0]?.url
        },
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        unitPrice: {
          [currencyKey]: unitPrice,
          [currencyKey === 'usd' ? 'khr' : 'usd']: item.product.price[currencyKey === 'usd' ? 'khr' : 'usd']
        },
        totalPrice: {
          [currencyKey]: totalPrice,
          [currencyKey === 'usd' ? 'khr' : 'usd']: item.product.price[currencyKey === 'usd' ? 'khr' : 'usd'] * item.quantity
        }
      };
    });

    // Apply promo code if provided
    let discount = 0;
    let promoDetails = null;
    if (promoCode) {
      // TODO: Implement promo code validation
      // For now, we'll skip this and implement it later
    }

    const shipping = 0; // Free shipping for now
    const tax = 0; // No tax for now
    const total = subtotal - discount + shipping + tax;

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totals: {
        subtotal: {
          [currencyKey]: subtotal,
          [currencyKey === 'usd' ? 'khr' : 'usd']: subtotal * (currencyKey === 'usd' ? 4100 : 1/4100) // Rough conversion
        },
        shipping: {
          [currencyKey]: shipping,
          [currencyKey === 'usd' ? 'khr' : 'usd']: shipping
        },
        tax: {
          [currencyKey]: tax,
          [currencyKey === 'usd' ? 'khr' : 'usd']: tax
        },
        discount: {
          [currencyKey]: discount,
          [currencyKey === 'usd' ? 'khr' : 'usd']: discount
        },
        total: {
          [currencyKey]: total,
          [currencyKey === 'usd' ? 'khr' : 'usd']: total * (currencyKey === 'usd' ? 4100 : 1/4100)
        }
      },
      currency,
      paymentMethod,
      shippingAddress,
      promoCode: promoDetails
    });

    await order.save();

    // Clear cart after successful order creation
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    // Send notifications
    try {
      // Send email confirmation
      const emailResult = await sendOrderConfirmationEmail(order, req.user);
      console.log('Email confirmation result:', emailResult);

      // Send Telegram notification if user has Telegram chat ID
      if (req.user.telegramChatId) {
        const telegramResult = await sendTelegramNotification(order, req.user, req.user.telegramChatId);
        console.log('Telegram notification result:', telegramResult);
      }
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't fail the order creation if notifications fail
    }
    // Populate order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name images')
      .lean();

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Admin: Get all orders
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: Update order status
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) updateData.notes = notes;
    if (status === 'delivered') updateData.actualDelivery = new Date();

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // TODO: Send notification to user (email/telegram)

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Track order by order number (public endpoint for customers)
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber })
      .select('orderNumber status estimatedDelivery actualDelivery trackingNumber createdAt')
      .lean();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Order tracking error:', error);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

module.exports = router;