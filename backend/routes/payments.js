const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// PayWay configuration
const PAYWAY_CONFIG = {
  merchantId: process.env.ABA_PAYWAY_MERCHANT_ID || 'ec461004',
  publicKey: process.env.ABA_PAYWAY_PUBLIC_KEY || 'c5b158047e0d89e1e0c5cfd74bd2e83670cbf2bd',
  rsaPublicKey: process.env.ABA_PAYWAY_RSA_PUBLIC_KEY || '',
  rsaPrivateKey: process.env.ABA_PAYWAY_RSA_PRIVATE_KEY || '',
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://checkout.payway.com.kh' 
    : 'https://checkout-sandbox.payway.com.kh'
};

// Generate hash for PayWay API
const generateHash = (data) => {
  try {
    const hash = crypto.createHash('sha512');
    hash.update(data + PAYWAY_CONFIG.publicKey);
    return hash.digest('hex');
  } catch (error) {
    console.error('Hash generation error:', error);
    throw new Error('Failed to generate hash');
  }
};

// Create hash string from parameters
const createHashString = (params) => {
  const sortedKeys = Object.keys(params).sort();
  return sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&');
};

// Create PayWay payment
router.post('/payway/create', authenticateToken, async (req, res) => {
  try {
    const { orderId, returnUrl, cancelUrl } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Get order details
    const order = await Order.findById(orderId)
      .populate('user', 'name email phone')
      .populate('items.product', 'name');

    if (!order || order.user._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const reqTime = new Date().toISOString().replace(/[:.]/g, '').slice(0, -1);
    
    const purchaseData = {
      req_time: reqTime,
      merchant_id: PAYWAY_CONFIG.merchantId,
      order_id: order.orderNumber,
      amount: Math.round(order.totals.total[order.currency.toLowerCase()]),
      currency: order.currency,
      description: `FemFit Order ${order.orderNumber}`,
      return_url: returnUrl || `${req.protocol}://${req.get('host')}/checkout/success`,
      cancel_url: cancelUrl || `${req.protocol}://${req.get('host')}/checkout/cancel`,
      customer_name: order.shippingAddress.fullName,
      customer_email: order.user.email,
      customer_phone: order.shippingAddress.phone || order.user.phone || ''
    };

    // Generate hash
    const hashString = createHashString(purchaseData);
    const hash = generateHash(hashString);

    const purchaseRequest = {
      ...purchaseData,
      items: order.items.map(item => ({
        name: item.productSnapshot.name,
        quantity: item.quantity,
        price: item.unitPrice[order.currency.toLowerCase()]
      })),
      hash
    };

    // Log purchase request for monitoring (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('PayWay Purchase Request:', {
        ...purchaseRequest,
        hash: hash.substring(0, 20) + '...'
      });
    }

    // Make request to PayWay API
    const response = await fetch(`${PAYWAY_CONFIG.baseUrl}/api/payment-gateway/v1/payments/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(purchaseRequest),
    });

    const responseText = await response.text();
    // Log response for monitoring (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('PayWay Response:', responseText);
    }

    if (!response.ok) {
      throw new Error(`PayWay API error: ${response.status} - ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

    if (data.status === 200 && data.data) {
      // Update order with payment details
      order.paymentDetails = {
        transactionId: data.data.transaction_id,
        paymentIntentId: data.data.transaction_id
      };
      await order.save();

      res.json({
        success: true,
        paymentUrl: data.data.payment_url,
        transactionId: data.data.transaction_id,
        orderNumber: order.orderNumber
      });
    } else {
      res.status(400).json({
        success: false,
        error: data.message || 'Payment creation failed'
      });
    }
  } catch (error) {
    console.error('PayWay payment creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment creation failed'
    });
  }
});

// PayWay webhook handler
router.post('/payway/webhook', async (req, res) => {
  try {
    const { transaction_id, status, order_id } = req.body;

    if (!transaction_id || !order_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find order by order number
    const order = await Order.findOne({ orderNumber: order_id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order based on payment status
    switch (status) {
      case 'completed':
        order.paymentStatus = 'completed';
        order.status = 'processing';
        order.paymentDetails.paymentDate = new Date();
        break;
      case 'failed':
        order.paymentStatus = 'failed';
        break;
      case 'cancelled':
        order.paymentStatus = 'failed';
        order.status = 'cancelled';
        break;
    }

    await order.save();

    // Send notification to customer
    try {
      await sendCustomerNotification(order, status);
    } catch (notificationError) {
      // Log notification error but don't fail the webhook
      if (process.env.NODE_ENV === 'development') {
        console.log('Notification error (non-critical):', notificationError.message);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('PayWay webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Verify payment status
router.get('/verify/:transactionId', authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Find order by transaction ID
    const order = await Order.findOne({ 
      'paymentDetails.transactionId': transactionId 
    });

    if (!order) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      transactionId,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Admin: Get all orders
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email')
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

/**
 * Send customer notification based on payment status
 */
async function sendCustomerNotification(order, status) {
  try {
    const { user, orderNumber, totalAmount, items } = order;
    
    // Get user details
    const userDetails = await User.findById(user).select('name email phone');
    if (!userDetails) {
      throw new Error('User not found for notification');
    }

    const notificationData = {
      orderNumber,
      customerName: userDetails.name,
      customerEmail: userDetails.email,
      customerPhone: userDetails.phone,
      totalAmount,
      itemCount: items.length,
      status,
      timestamp: new Date()
    };

    // Send email notification
    await sendEmailNotification(notificationData);
    
    // Send SMS notification if phone number exists
    if (userDetails.phone) {
      await sendSMSNotification(notificationData);
    }

    // Log notification sent
    if (process.env.NODE_ENV === 'development') {
      console.log('Customer notification sent:', {
        orderNumber,
        customerEmail: userDetails.email,
        status
      });
    }
  } catch (error) {
    throw new Error(`Failed to send customer notification: ${error.message}`);
  }
}

/**
 * Send email notification
 */
async function sendEmailNotification(data) {
  try {
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    // For now, we'll simulate the email sending
    const emailContent = generateEmailContent(data);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Email notification would be sent:', {
        to: data.customerEmail,
        subject: `Order ${data.status === 'completed' ? 'Confirmation' : 'Update'}`,
        content: emailContent.substring(0, 100) + '...'
      });
    }
    
    // In production, this would send actual emails
    // await emailService.send({
    //   to: data.customerEmail,
    //   subject: `Order ${data.status === 'completed' ? 'Confirmation' : 'Update'}`,
    //   html: emailContent
    // });
  } catch (error) {
    throw new Error(`Email notification failed: ${error.message}`);
  }
}

/**
 * Send SMS notification
 */
async function sendSMSNotification(data) {
  try {
    // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
    // For now, we'll simulate the SMS sending
    
    if (process.env.NODE_ENV === 'development') {
      console.log('SMS notification would be sent:', {
        to: data.customerPhone,
        message: `Your order ${data.orderNumber} has been ${data.status === 'completed' ? 'confirmed' : 'updated'}.`
      });
    }
    
    // In production, this would send actual SMS
    // await smsService.send({
    //   to: data.customerPhone,
    //   message: `Your order ${data.orderNumber} has been ${data.status === 'completed' ? 'confirmed' : 'updated'}.`
    // });
  } catch (error) {
    throw new Error(`SMS notification failed: ${error.message}`);
  }
}

/**
 * Generate email content
 */
function generateEmailContent(data) {
  const statusText = data.status === 'completed' ? 'confirmed' : 'updated';
  const actionText = data.status === 'completed' ? 'We are now processing your order' : 'Your order status has been updated';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}</h2>
      <p>Dear ${data.customerName},</p>
      <p>${actionText}.</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Total Amount:</strong> $${data.totalAmount}</p>
        <p><strong>Items:</strong> ${data.itemCount}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Date:</strong> ${data.timestamp.toLocaleDateString()}</p>
      </div>
      
      <p>Thank you for choosing our service!</p>
      <p>Best regards,<br>FemFit Team</p>
    </div>
  `;
}

module.exports = router;