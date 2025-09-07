const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minimumOrderAmount: {
    usd: {
      type: Number,
      default: 0
    },
    khr: {
      type: Number,
      default: 0
    }
  },
  maxUsage: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: String,
    enum: ['clothes', 'accessories', 'perfume', 'cosmetic', 'sanitary', 'other']
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderNumber: String
  }]
}, {
  timestamps: true
});

// Check if promo code is valid
promoCodeSchema.methods.isValid = function() {
  const now = new Date();
  return this.isActive && 
         now >= this.validFrom && 
         now <= this.validUntil &&
         (this.maxUsage === null || this.usedCount < this.maxUsage);
};

// Check if user can use this promo code
promoCodeSchema.methods.canUserUse = function(userId) {
  return !this.usedBy.some(usage => usage.user.toString() === userId.toString());
};

module.exports = mongoose.model('PromoCode', promoCodeSchema);