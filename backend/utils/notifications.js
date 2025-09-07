const nodemailer = require('nodemailer');
const axios = require('axios');

// Email configuration
const createEmailTransporter = () => {
  // For development, use Ethereal Email (fake SMTP service)
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }

  // For production, configure with your email service
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const transporter = createEmailTransporter();
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - FEMFIT</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: #fff; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-weight: bold; font-size: 18px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FEMFIT</h1>
            <h2>Order Confirmation</h2>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Thank you for your order! We're excited to prepare your luxury items.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
              
              <h4>Items Ordered:</h4>
              ${order.items.map(item => `
                <div class="item">
                  <strong>${item.productSnapshot.name}</strong><br>
                  Quantity: ${item.quantity}<br>
                  ${item.selectedSize ? `Size: ${item.selectedSize}<br>` : ''}
                  Price: $${item.unitPrice[order.currency.toLowerCase()].toFixed(2)}
                </div>
              `).join('')}
              
              <div class="total">
                <p>Total: $${order.totals.total[order.currency.toLowerCase()].toFixed(2)} ${order.currency}</p>
              </div>
            </div>
            
            <div class="order-details">
              <h3>Shipping Address</h3>
              <p>
                ${order.shippingAddress.fullName}<br>
                ${order.shippingAddress.phone}<br>
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.province}<br>
                ${order.shippingAddress.country}
              </p>
            </div>
            
            <p>We'll send you another email when your order ships with tracking information.</p>
            <p>If you have any questions, please contact our customer service team.</p>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing FEMFIT</p>
            <p>© 2025 FEMFIT. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'orders@luxe.com',
      to: user.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: emailHtml
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send Telegram notification
const sendTelegramNotification = async (order, user, telegramChatId) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken || !telegramChatId) {
      console.log('Telegram notification skipped - missing bot token or chat ID');
      return { success: false, error: 'Missing Telegram configuration' };
    }

    const message = `
🛍️ *Order Confirmation - FEMFIT*

Hello ${user.name}!

Your order has been confirmed:
📦 Order Number: \`${order.orderNumber}\`
📅 Order Date: ${new Date(order.createdAt).toLocaleDateString()}
🚚 Estimated Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}

*Items Ordered:*
${order.items.map(item => 
  `• ${item.productSnapshot.name} (Qty: ${item.quantity})${item.selectedSize ? ` - Size: ${item.selectedSize}` : ''}`
).join('\n')}

💰 Total: $${order.totals.total[order.currency.toLowerCase()].toFixed(2)} ${order.currency}

📍 *Shipping Address:*
${order.shippingAddress.fullName}
${order.shippingAddress.phone}
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.province}
${order.shippingAddress.country}

We'll notify you when your order ships!

Thank you for choosing FEMFIT ✨
    `;

    const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: telegramChatId,
      text: message,
      parse_mode: 'Markdown'
    });

    console.log('Telegram notification sent:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Telegram notification error:', error);
    return { success: false, error: error.message };
  }
};

// Send order status update
const sendOrderStatusUpdate = async (order, user, telegramChatId) => {
  try {
    // Send email update
    const emailResult = await sendOrderStatusEmail(order, user);
    
    // Send Telegram update if chat ID is available
    let telegramResult = { success: false };
    if (telegramChatId) {
      telegramResult = await sendTelegramStatusUpdate(order, user, telegramChatId);
    }

    return {
      email: emailResult,
      telegram: telegramResult
    };
  } catch (error) {
    console.error('Order status update error:', error);
    return { error: error.message };
  }
};

const sendOrderStatusEmail = async (order, user) => {
  try {
    const transporter = createEmailTransporter();
    
    const statusMessages = {
      processing: 'Your order is being prepared',
      shipped: 'Your order has been shipped',
      delivered: 'Your order has been delivered'
    };

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Update - FEMFIT</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .status { background: #fff; padding: 15px; margin: 15px 0; border-radius: 5px; text-align: center; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FEMFIT</h1>
            <h2>Order Update</h2>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <div class="status">
              <h3>Order Status Update</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Status:</strong> ${statusMessages[order.status] || order.status}</p>
              ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
            </div>
            
            <p>You can track your order status anytime by visiting your account dashboard.</p>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing FEMFIT</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'orders@luxe.com',
      to: user.email,
      subject: `Order Update - ${order.orderNumber}`,
      html: emailHtml
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Status email error:', error);
    return { success: false, error: error.message };
  }
};

const sendTelegramStatusUpdate = async (order, user, telegramChatId) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      return { success: false, error: 'Missing Telegram bot token' };
    }

    const statusEmojis = {
      processing: '⏳',
      shipped: '🚚',
      delivered: '✅'
    };

    const message = `
${statusEmojis[order.status] || '📦'} *Order Status Update*

Hello ${user.name}!

Your order \`${order.orderNumber}\` status has been updated:

*Status:* ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
${order.trackingNumber ? `*Tracking:* \`${order.trackingNumber}\`` : ''}

${order.status === 'shipped' ? '🚚 Your order is on its way!' : ''}
${order.status === 'delivered' ? '🎉 Your order has been delivered! Enjoy your FEMFIT items!' : ''}

Track your order anytime in your account dashboard.
    `;

    const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: telegramChatId,
      text: message,
      parse_mode: 'Markdown'
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Telegram status update error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendTelegramNotification,
  sendOrderStatusUpdate
};