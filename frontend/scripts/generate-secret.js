#!/usr/bin/env node

/**
 * Generate a secure random secret for NextAuth
 * Run this script to generate a secure NEXTAUTH_SECRET
 */

const crypto = require('crypto');

// Generate a secure random string
const secret = crypto.randomBytes(32).toString('base64');

console.log('🔐 Generated NextAuth Secret:');
console.log('================================');
console.log(secret);
console.log('================================');
console.log('');
console.log('📝 Copy this value to your .env.local file:');
console.log(`NEXTAUTH_SECRET=${secret}`);
console.log('');
console.log('⚠️  Keep this secret secure and never commit it to version control!');
console.log('✅ This secret is cryptographically secure and suitable for production use.');
