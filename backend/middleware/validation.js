const { body, validationResult } = require('express-validator');
const { sanitizeInput, validateEmail, validatePhone } = require('../utils/validation');

// Validation middleware factory
const createValidationMiddleware = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Sanitize inputs
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeInput(req.body[key]);
        }
      });
    }

    next();
  };
};

// User registration validation
const validateUserRegistration = createValidationMiddleware([
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\u1780-\u17FF]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('phone')
    .optional()
    .custom((value) => {
      if (value && !validatePhone(value)) {
        throw new Error('Please provide a valid Cambodian phone number');
      }
      return true;
    })
]);

// User login validation
const validateUserLogin = createValidationMiddleware([
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]);

// Shipping address validation
const validateShippingAddress = createValidationMiddleware([
  body('fullName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\u1780-\u17FF]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('phone')
    .custom((value) => {
      if (!validatePhone(value)) {
        throw new Error('Please provide a valid Cambodian phone number');
      }
      return true;
    }),
  
  body('street')
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),
  
  body('city')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\u1780-\u17FF]+$/)
    .withMessage('City can only contain letters and spaces'),
  
  body('province')
    .isLength({ min: 2, max: 50 })
    .withMessage('Province must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\u1780-\u17FF]+$/)
    .withMessage('Province can only contain letters and spaces'),
  
  body('postalCode')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Postal code cannot exceed 10 characters')
]);

// Product validation
const validateProduct = createValidationMiddleware([
  body('name')
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  
  body('description')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('price.usd')
    .isFloat({ min: 0 })
    .withMessage('USD price must be a positive number'),
  
  body('price.khr')
    .isFloat({ min: 0 })
    .withMessage('KHR price must be a positive number'),
  
  body('category')
    .isIn(['clothes', 'accessories', 'perfume', 'cosmetic', 'sanitary', 'other'])
    .withMessage('Invalid category'),
  
  body('totalStock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
]);

// Order validation
const validateOrder = createValidationMiddleware([
  body('shippingAddress').custom((value) => {
    if (!value || typeof value !== 'object') {
      throw new Error('Shipping address is required');
    }
    return true;
  }),
  
  body('paymentMethod')
    .isIn(['payway', 'cod'])
    .withMessage('Invalid payment method'),
  
  body('currency')
    .isIn(['USD', 'KHR'])
    .withMessage('Invalid currency')
]);

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateShippingAddress,
  validateProduct,
  validateOrder,
  createValidationMiddleware
};