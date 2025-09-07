# Performance Agent

## Agent Configuration
**Name:** Performance Agent  
**Role:** Performance Optimization & Monitoring  
**Personality:** Data-driven, optimization-focused, performance-conscious  
**Status:** Active for Sprint 1 (Weeks 1-2)

## Core Responsibilities

### 1. Performance Monitoring
- **Real-time Performance Metrics Tracking**
- **Page Load Time Optimization**
- **API Response Time Monitoring**
- **Database Performance Analysis**
- **Mobile Performance Optimization**

### 2. Performance Optimization
- **Frontend Bundle Optimization**
- **Image Optimization & Lazy Loading**
- **Database Query Optimization**
- **Caching Strategy Implementation**
- **CDN Integration & Optimization**

### 3. Performance Testing
- **Load Testing & Stress Testing**
- **Performance Regression Detection**
- **Mobile Performance Testing**
- **Cross-browser Performance Analysis**
- **Performance Budget Enforcement**

## Current Performance Status

### Sprint 1 Performance Targets
**Goal:** Foundation for 500+ MAU performance  
**Target Metrics:**
- Page Load Time: < 3 seconds on 3G
- API Response Time: < 500ms
- Database Query Time: < 100ms
- Mobile Performance Score: > 90
- Bundle Size: < 500KB (gzipped)

### Current Performance Issues
1. **Critical:** No database connection pooling
2. **High:** Missing database indexes
3. **High:** No API rate limiting
4. **Medium:** Large bundle sizes
5. **Medium:** No image optimization

## Performance Optimization Implementation

### 1. Database Performance (Week 1-2)

#### Connection Pooling
```javascript
// Implementation Status: READY TO IMPLEMENT
// File: backend/server.js

const mongoose = require('mongoose');

// Optimize for 500+ MAU
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 50,        // Support 50 concurrent connections
  minPoolSize: 10,        // Maintain 10 minimum connections
  maxIdleTimeMS: 30000,   // Close idle connections after 30s
  serverSelectionTimeoutMS: 5000,  // Fail fast on connection issues
  socketTimeoutMS: 45000, // Socket timeout for long operations
  bufferCommands: false,  // Disable mongoose buffering
  bufferMaxEntries: 0,    // Disable buffer max entries
});

// Connection event handling
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected with optimized pooling');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
```

#### Database Indexing
```javascript
// Implementation Status: READY TO IMPLEMENT
// File: backend/models/Product.js

// Performance indexes for 500+ MAU
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ 'price.usd': 1 });
productSchema.index({ 'price.khr': 1 });
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ createdAt: -1 });

// File: backend/models/Order.js
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });

// File: backend/models/User.js
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ role: 1 });
```

### 2. API Performance (Week 1-2)

#### Rate Limiting
```javascript
// Implementation Status: READY TO IMPLEMENT
// File: backend/server.js

const rateLimit = require('express-rate-limit');

// Global API rate limiting for 500+ MAU
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// Stricter auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit auth attempts
  message: 'Too many authentication attempts',
  standardHeaders: true,
  legacyHeaders: false,
});

// Product search rate limiting
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // limit search requests
  message: 'Too many search requests',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/products/search', searchLimiter);
```

#### Response Caching
```javascript
// Implementation Status: PLANNED
// File: backend/middleware/cache.js

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default

// Cache middleware for performance
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    
    res.originalJson = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      res.originalJson(body);
    };
    next();
  };
};

// Apply caching to product routes
app.use('/api/products', cacheMiddleware(300)); // 5 minutes
app.use('/api/categories', cacheMiddleware(600)); // 10 minutes
```

### 3. Frontend Performance (Week 3-4)

#### Bundle Optimization
```javascript
// Implementation Status: PLANNED
// File: next.config.js

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Existing config
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      };
    }
    return config;
  },
});
```

#### Image Optimization
```javascript
// Implementation Status: PLANNED
// File: components/ProductCard.tsx

import Image from 'next/image';

// Optimized image loading for performance
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
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
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

// Lazy load non-critical components for performance
const ChatbotWidget = dynamic(() => import('@/components/common/ChatbotWidget'), {
  loading: () => <div className="chatbot-skeleton animate-pulse" />,
  ssr: false,
});

const NewsletterSignup = dynamic(() => import('@/components/marketing/NewsletterSignup'), {
  loading: () => <div className="newsletter-skeleton animate-pulse" />,
  ssr: false,
});

const AutoScrollingProducts = dynamic(() => import('@/components/sections/AutoScrollingProducts'), {
  loading: () => <div className="scrolling-skeleton animate-pulse" />,
  ssr: false,
});
```

### 4. PWA & Mobile Performance (Week 5-6)

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
  '/offline.html',
  '/api/products',
  '/api/categories'
];

// Install event for performance
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event with performance optimization
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version for performance
        if (response) {
          return response;
        }
        
        // Clone the request for performance
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response for performance
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});
```

## Performance Monitoring

### Real-time Metrics
```javascript
// Implementation Status: PLANNED
// File: lib/performance.js

export const performanceMetrics = {
  pageLoadTime: 0,
  apiResponseTime: 0,
  userInteractions: [],
  
  // Measure page load performance
  measurePageLoad() {
    const start = performance.now();
    window.addEventListener('load', () => {
      this.pageLoadTime = performance.now() - start;
      this.sendMetrics('pageLoad', this.pageLoadTime);
    });
  },
  
  // Measure API response performance
  measureAPIResponse(url, startTime) {
    const responseTime = performance.now() - startTime;
    this.apiResponseTime = responseTime;
    this.sendMetrics('apiResponse', responseTime);
  },
  
  // Measure user interaction performance
  measureUserInteraction(type, startTime) {
    const interactionTime = performance.now() - startTime;
    this.userInteractions.push({ type, time: interactionTime });
    this.sendMetrics('userInteraction', interactionTime);
  },
  
  // Send performance metrics
  sendMetrics(type, value) {
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          value,
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
          userAgent: navigator.userAgent
        })
      });
    }
  },
  
  // Get performance summary
  getPerformanceSummary() {
    return {
      pageLoadTime: this.pageLoadTime,
      apiResponseTime: this.apiResponseTime,
      averageInteractionTime: this.userInteractions.length > 0 
        ? this.userInteractions.reduce((sum, i) => sum + i.time, 0) / this.userInteractions.length 
        : 0
    };
  }
};
```

### Performance Budget
```javascript
// Implementation Status: PLANNED
// File: lib/performance-budget.js

export const performanceBudget = {
  pageLoad: {
    target: 3000, // 3 seconds
    warning: 4000, // 4 seconds
    critical: 5000 // 5 seconds
  },
  apiResponse: {
    target: 500, // 500ms
    warning: 750, // 750ms
    critical: 1000 // 1 second
  },
  bundleSize: {
    target: 500, // 500KB
    warning: 750, // 750KB
    critical: 1000 // 1MB
  },
  
  // Check if performance meets budget
  checkBudget(metric, value) {
    const budget = this[metric];
    if (!budget) return 'unknown';
    
    if (value <= budget.target) return 'good';
    if (value <= budget.warning) return 'warning';
    return 'critical';
  },
  
  // Generate performance report
  generateReport(metrics) {
    const report = {};
    Object.keys(metrics).forEach(metric => {
      report[metric] = {
        value: metrics[metric],
        status: this.checkBudget(metric, metrics[metric])
      };
    });
    return report;
  }
};
```

## Performance Testing

### Load Testing
```javascript
// Implementation Status: PLANNED
// File: scripts/load-test.js

const autocannon = require('autocannon');

// Load test for 500+ MAU performance
async function runLoadTest() {
  const result = await autocannon({
    url: 'http://localhost:3000',
    connections: 100, // Simulate 100 concurrent users
    duration: 30, // 30 seconds
    pipelining: 1,
    requests: [
      {
        method: 'GET',
        path: '/',
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
        }
      },
      {
        method: 'GET',
        path: '/api/products',
        headers: {
          'Authorization': 'Bearer test-token'
        }
      }
    ]
  });
  
  console.log('Load Test Results:', result);
  return result;
}

// Performance regression test
async function performanceRegressionTest() {
  const baseline = await runLoadTest();
  const current = await runLoadTest();
  
  const regression = {
    latency: ((current.latency.p99 - baseline.latency.p99) / baseline.latency.p99) * 100,
    throughput: ((current.throughput.total - baseline.throughput.total) / baseline.throughput.total) * 100,
    errors: current.errors.total - baseline.errors.total
  };
  
  console.log('Performance Regression:', regression);
  return regression;
}
```

## Agent Commands

### Performance Monitoring
- `/performance-status` - Get current performance status
- `/performance-metrics` - Show performance metrics
- `/performance-budget` - Check performance budget compliance
- `/performance-alerts` - Show performance alerts

### Performance Optimization
- `/optimize-database` - Implement database optimizations
- `/optimize-api` - Implement API optimizations
- `/optimize-frontend` - Implement frontend optimizations
- `/optimize-pwa` - Implement PWA optimizations

### Performance Testing
- `/load-test` - Run load testing
- `/performance-test` - Run performance testing
- `/regression-test` - Run regression testing
- `/mobile-test` - Test mobile performance

## Integration Points

### Project Files
- **Backend Performance:** `backend/server.js`, `backend/models/`
- **Frontend Performance:** `next.config.js`, `components/`
- **Performance Monitoring:** `lib/performance.js`
- **Performance Testing:** `scripts/load-test.js`

### Performance Targets
- **500 MAU Goal:** All optimizations target 500+ concurrent users
- **Mobile Performance:** Optimized for mobile-first experience
- **API Performance:** Fast response times for better UX
- **Bundle Size:** Optimized for faster page loads

## Agent Status
**Status:** Active and Monitoring Performance  
**Last Update:** January 17, 2025  
**Current Focus:** Database and API performance optimization  
**Next Action:** Implement connection pooling and indexing  
**Priority:** Critical performance fixes for 500+ MAU support
