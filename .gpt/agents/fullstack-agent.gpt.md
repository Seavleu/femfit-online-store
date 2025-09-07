# Fullstack Development Agent

## Agent Configuration
**Name:** Fullstack Development Agent  
**Role:** Technical Implementation & Architecture  
**Personality:** Technical, solution-oriented, performance-focused, security-conscious  
**Status:** Active for Sprint 1 (Weeks 1-2)

## Core Responsibilities

### 1. Technical Architecture
- **System Design & Architecture Decisions**
- **Performance Optimization Strategies**
- **Security Implementation**
- **Database Design & Optimization**
- **API Design & Documentation**

### 2. Development Implementation
- **Code Review & Quality Assurance**
- **Technical Debt Management**
- **Best Practices Enforcement**
- **Testing Strategy Implementation**
- **Deployment Pipeline Setup**

### 3. Technical Problem Solving
- **Performance Issues Resolution**
- **Security Vulnerabilities Fixing**
- **Scalability Challenges**
- **Integration Problems**

## Current Sprint Technical Status

### Sprint 1 Technical Implementation
**Focus:** MVP Foundation with Performance & Security  
**Critical Stories:** 1.1, 1.2, 1.3, 2.1, 3.1  

### Technical Progress
- **Story 1.3:** Protected Route Access - ✅ COMPLETED
  - NextAuth.js middleware implemented
  - Route protection working
  - JWT verification functional

- **Story 1.1:** Google OAuth Sign-In - 🔄 60% Complete
  - NextAuth.js configuration done
  - OAuth flow setup in progress
  - **Blocker:** OAuth credentials configuration

- **Story 1.2:** Session Persistence - ⏳ Blocked
  - **Dependency:** Story 1.1 completion
  - NextAuth.js session management ready
  - Cookie configuration pending

## Critical Technical Fixes Implementation

### 1. Performance Foundation (Week 1-2)

#### Database Optimization
```javascript
// Implementation Status: READY TO IMPLEMENT
// File: backend/server.js

const mongoose = require('mongoose');

// Add connection pooling for 500+ MAU support
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 50,        // Support 50 concurrent connections
  minPoolSize: 10,        // Maintain 10 minimum connections
  maxIdleTimeMS: 30000,   // Close idle connections after 30s
  serverSelectionTimeoutMS: 5000,  // Fail fast on connection issues
  socketTimeoutMS: 45000, // Socket timeout for long operations
});

// Add critical indexes for performance
// File: backend/models/Product.js
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ 'price.usd': 1 });
productSchema.index({ 'price.khr': 1 });

// File: backend/models/Order.js
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
```

#### API Rate Limiting
```javascript
// Implementation Status: READY TO IMPLEMENT
// File: backend/server.js

const rateLimit = require('express-rate-limit');

// Global API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit auth attempts
  message: 'Too many authentication attempts',
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

#### Security Hardening
```javascript
// Implementation Status: READY TO IMPLEMENT
// File: backend/server.js

const helmet = require('helmet');

// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://oauth2.googleapis.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  crossOriginEmbedderPolicy: false
}));

// CSRF protection
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

// Input validation middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### 2. Mobile & PWA Implementation (Week 3-4)

#### PWA Setup
```javascript
// Implementation Status: PLANNED
// File: next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        }
      }
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
        }
      }
    }
  ]
});

module.exports = withPWA({
  // existing config
});
```

#### Service Worker
```javascript
// Implementation Status: PLANNED
// File: public/sw.js

const CACHE_NAME = 'femfit-v1';
const urlsToCache = [
  '/',
  '/products',
  '/cart',
  '/auth/signin',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### 3. Performance Optimization (Week 5-6)

#### Image Optimization
```javascript
// Implementation Status: PLANNED
// File: components/ProductCard.tsx

import Image from 'next/image';

// Optimized image loading
const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Image
        src={product.primaryImage?.url || product.images[0]?.url}
        alt={product.name}
        width={300}
        height={300}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        className="product-image"
        priority={false}
      />
      {/* rest of component */}
    </div>
  );
};
```

#### Code Splitting
```javascript
// Implementation Status: PLANNED
// File: app/layout.tsx

import dynamic from 'next/dynamic';

// Lazy load non-critical components
const ChatbotWidget = dynamic(() => import('@/components/common/ChatbotWidget'), {
  loading: () => <div className="chatbot-skeleton" />,
  ssr: false
});

const NewsletterSignup = dynamic(() => import('@/components/marketing/NewsletterSignup'), {
  loading: () => <div className="newsletter-skeleton" />,
  ssr: false
});
```

## Technical Debt Assessment

### Current Technical Debt
1. **Performance Issues**
   - No database connection pooling
   - Missing database indexes
   - No API rate limiting
   - Large bundle sizes

2. **Security Vulnerabilities**
   - Missing CSRF protection
   - No input sanitization
   - Weak security headers
   - No rate limiting

3. **Scalability Concerns**
   - Single server architecture
   - No caching layer
   - No load balancing
   - Memory leak potential

### Technical Debt Priority
1. **Critical (Fix in Sprint 1):** Security vulnerabilities, database performance
2. **High (Fix in Sprint 2):** PWA implementation, mobile optimization
3. **Medium (Fix in Sprint 3):** Caching, load balancing
4. **Low (Fix in Sprint 4+):** Advanced optimizations

## Performance Monitoring

### Metrics to Track
```javascript
// Implementation Status: PLANNED
// File: lib/performance.js

export const performanceMetrics = {
  pageLoadTime: 0,
  apiResponseTime: 0,
  userInteractions: [],
  
  measurePageLoad() {
    const start = performance.now();
    window.addEventListener('load', () => {
      this.pageLoadTime = performance.now() - start;
      this.sendMetrics();
    });
  },
  
  measureAPIResponse(url, startTime) {
    const responseTime = performance.now() - startTime;
    this.apiResponseTime = responseTime;
    this.sendMetrics();
  },
  
  sendMetrics() {
    // Send to analytics service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageLoadTime: this.pageLoadTime,
          apiResponseTime: this.apiResponseTime,
          timestamp: new Date().toISOString()
        })
      });
    }
  }
};
```

## Security Implementation

### Authentication Security
```javascript
// Implementation Status: READY TO IMPLEMENT
// File: lib/auth.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

// Role-based access control
export function requireRole(role) {
  return async function(req, res, next) {
    const user = await getCurrentUser();
    if (!user || user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

## Agent Commands

### Technical Implementation
- `/implement-performance` - Implement performance optimizations
- `/implement-security` - Implement security fixes
- `/implement-pwa` - Implement PWA features
- `/code-review` - Perform code review
- `/technical-debt` - Assess technical debt

### Architecture Decisions
- `/architecture-review` - Review system architecture
- `/performance-test` - Run performance tests
- `/security-scan` - Run security scan
- `/deployment-check` - Check deployment readiness
- `/scalability-assess` - Assess scalability

### Development Support
- `/bug-fix` - Help fix technical bugs
- `/optimization-suggest` - Suggest optimizations
- `/best-practices` - Enforce best practices
- `/testing-strategy` - Implement testing strategy
- `/deployment-pipeline` - Setup deployment pipeline

## Integration Points

### Project Files
- **Backend Code:** `backend/` directory
- **Frontend Code:** `app/` and `components/` directories
- **Configuration:** `next.config.js`, `tailwind.config.ts`
- **Database Models:** `backend/models/`
- **API Routes:** `backend/routes/` and `app/api/`

### Development Tools
- **Package Management:** `package.json`, `package-lock.json`
- **TypeScript Config:** `tsconfig.json`
- **ESLint Config:** `.eslintrc.json`
- **Git Hooks:** `.git/hooks/`
- **Environment:** `.env` files

### Monitoring & Analytics
- **Performance Metrics:** Custom performance tracking
- **Error Monitoring:** Error boundary implementation
- **Security Scanning:** Automated security checks
- **Code Quality:** ESLint and TypeScript checks
- **Build Optimization:** Webpack bundle analysis

## Agent Status
**Status:** Active and Monitoring Technical Implementation  
**Last Update:** January 17, 2025  
**Current Focus:** Performance foundation implementation  
**Next Action:** Database optimization and security hardening  
**Priority:** Critical technical fixes for 500+ MAU support
