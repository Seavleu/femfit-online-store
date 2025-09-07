const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token (reads from Authorization header or HTTP-only cookie)
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    const cookieToken = req.cookies && (req.cookies.ff_jwt || req.cookies.token || req.cookies.auth_token);
    const token = headerToken || cookieToken; 

    if (!token) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[auth] No token found. Headers and cookies snapshot:');
        console.warn('headers.authorization:', req.headers.authorization);
        console.warn('cookie names:', req.headers.cookie ? req.headers.cookie.split(';').map(s => s.split('=')[0].trim()) : []);
      }
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

// Middleware for admin-only routes
const requireAdmin = requireRole('admin');

// Middleware for shopper and admin routes
const requireShopperOrAdmin = requireRole(['shopper', 'admin']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireShopperOrAdmin
};