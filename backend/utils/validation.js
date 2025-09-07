const validator = require('validator');
const crypto = require('crypto');

// Validate email
const validateEmail = (email) => {
  return validator.isEmail(email);
};

// Validate phone number (Cambodia format)
const validatePhone = (phone) => {
  // Cambodia phone numbers: +855 followed by 8-9 digits
  const cambodianPhoneRegex = /^(\+855|855|0)?[1-9]\d{7,8}$/;
  return cambodianPhoneRegex.test(phone.replace(/\s/g, ''));
};

// Validate password strength
const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    errors: [
      ...(password.length < 6 ? ['Password must be at least 6 characters'] : []),
      ...(!/[A-Za-z]/.test(password) ? ['Password must contain at least one letter'] : []),
      ...(!/\d/.test(password) ? ['Password must contain at least one number'] : [])
    ]
  };
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags and escape special characters
  let sanitized = input.trim();
  
  // Remove script tags and javascript: protocol
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Escape HTML entities
  sanitized = validator.escape(sanitized);
  
  return sanitized;
};

// Hash sensitive data
const hashSensitiveData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Encrypt sensitive data
const encryptSensitiveData = (data, key) => {
  const algorithm = 'aes-256-gcm';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag().toString('hex')
  };
};

// Decrypt sensitive data
const decryptSensitiveData = (encryptedData, key) => {
  const algorithm = 'aes-256-gcm';
  const decipher = crypto.createDecipher(algorithm, key);
  
  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Validate shipping address
const validateShippingAddress = (address) => {
  const errors = [];

  if (!address.fullName || address.fullName.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }

  if (!address.phone || !validatePhone(address.phone)) {
    errors.push('Valid phone number is required');
  }

  if (!address.street || address.street.trim().length < 5) {
    errors.push('Street address is required and must be at least 5 characters');
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.push('City is required');
  }

  if (!address.province || address.province.trim().length < 2) {
    errors.push('Province is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate product data
const validateProductData = (productData) => {
  const errors = [];

  if (!productData.name || productData.name.trim().length < 2) {
    errors.push('Product name is required and must be at least 2 characters');
  }

  if (!productData.description || productData.description.trim().length < 10) {
    errors.push('Product description is required and must be at least 10 characters');
  }

  if (!productData.price || !productData.price.usd || productData.price.usd <= 0) {
    errors.push('Valid USD price is required');
  }

  if (!productData.price || !productData.price.khr || productData.price.khr <= 0) {
    errors.push('Valid KHR price is required');
  }

  if (!productData.category) {
    errors.push('Product category is required');
  }

  const validCategories = ['clothes', 'accessories', 'perfume', 'cosmetic', 'sanitary', 'other'];
  if (productData.category && !validCategories.includes(productData.category.toLowerCase())) {
    errors.push('Invalid product category');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  sanitizeInput,
  validateShippingAddress,
  validateProductData,
  hashSensitiveData,
  encryptSensitiveData,
  decryptSensitiveData
};