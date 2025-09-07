// Environment configuration for the frontend
// This file handles environment variables safely and provides defaults

export const env = {
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/femfit',
  
  // NextAuth
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
  
  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  
  // Stripe (removed - using ABA PayWay instead)
  
  // PayWay
  PAYWAY_MERCHANT_ID: process.env.PAYWAY_MERCHANT_ID || '',
  PAYWAY_API_KEY: process.env.PAYWAY_API_KEY || '',
  PAYWAY_WEBHOOK_SECRET: process.env.PAYWAY_WEBHOOK_SECRET || '',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API URLs
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
} as const;

// Validate required environment variables in production
export const validateEnv = () => {
  if (process.env.NODE_ENV === 'production') {
    const required = [
      'MONGODB_URI',
      'NEXTAUTH_SECRET',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
};

// Export individual variables for convenience
export const {
  MONGODB_URI,
  NEXTAUTH_URL,
  NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  // Stripe exports removed
  PAYWAY_MERCHANT_ID,
  PAYWAY_API_KEY,
  PAYWAY_WEBHOOK_SECRET,
  NODE_ENV,
  API_BASE_URL,
  BACKEND_URL,
} = env;
