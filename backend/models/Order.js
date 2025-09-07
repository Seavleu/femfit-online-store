const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productSnapshot: {
    name: String,
    price: {
      usd: Number,
      khr: Number
    },
    image: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  selectedSize: String,
  selectedColor: String,
  unitPrice: {
    usd: {
      type: Number,
      required: true
    },
    khr: {
      type: Number,
      required: true
    }
  },
  totalPrice: {
    usd: {
      type: Number,
      required: true
    },
    khr: {
      type: Number,
      required: true
    }
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totals: {
    subtotal: {
      usd: Number,
      khr: Number
    },
    shipping: {
      usd: {
        type: Number,
        default: 0
      },
      khr: {
        type: Number,
        default: 0
      }
    },
    tax: {
      usd: {
        type: Number,
        default: 0
      },
      khr: {
        type: Number,
        default: 0
      }
    },
    discount: {
      usd: {
        type: Number,
        default: 0
      },
      khr: {
        type: Number,
        default: 0
      }
    },
    total: {
      usd: Number,
      khr: Number
    }
  },
  currency: {
    type: String,
    enum: ['USD', 'KHR'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['payway', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentIntentId: String,
    paymentDate: Date
  },
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    postalCode: String,
    country: {
      type: String,
      default: 'Cambodia'
    },
    notes: String
  },
  estimatedDelivery: {
    type: Date,
    required: true
  },
  actualDelivery: Date,
  trackingNumber: String,
  notes: String,
  promoCode: {
    code: String,
    discount: {
      type: Number,
      default: 0
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `FF${String(count + 1).padStart(6, '0')}`;
  }
  
  // Set estimated delivery (1-2 days from now)
  if (!this.estimatedDelivery) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 2) + 1);
    this.estimatedDelivery = deliveryDate;
  }
  
  next();
});

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);