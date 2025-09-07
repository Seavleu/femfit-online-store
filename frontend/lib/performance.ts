'use client';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track page load time
  trackPageLoad(pageName: string) {
    if (typeof window === 'undefined') return;

    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
      this.recordMetric(`page_load_${pageName}`, loadTime);
      
      // Send to Google Analytics
      if (window.gtag) {
        window.gtag('event', 'page_load_time', {
          event_category: 'Performance',
          event_label: pageName,
          value: Math.round(loadTime)
        });
      }
    }
  }

  // Track API response time
  trackApiCall(endpoint: string, duration: number) {
    this.recordMetric(`api_${endpoint}`, duration);
    
    // Send to Google Analytics if over threshold
    if (duration > 500) {
      if (window.gtag) {
        window.gtag('event', 'slow_api_response', {
          event_category: 'Performance',
          event_label: endpoint,
          value: Math.round(duration)
        });
      }
    }
  }

  // Track chatbot response time
  trackChatbotResponse(duration: number) {
    this.recordMetric('chatbot_response', duration);
    
    if (window.gtag) {
      window.gtag('event', 'chatbot_response_time', {
        event_category: 'Performance',
        event_label: 'chatbot',
        value: Math.round(duration)
      });
    }
  }

  private recordMetric(key: string, value: number) {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const values = this.metrics.get(key)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  // Get performance statistics
  getStats(metricKey: string) {
    const values = this.metrics.get(metricKey) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    const p90Index = Math.floor(sorted.length * 0.90);

    return {
      count: values.length,
      average: values.reduce((a, b) => a + b, 0) / values.length,
      p90: sorted[p90Index],
      p95: sorted[p95Index],
      min: sorted[0],
      max: sorted[sorted.length - 1]
    };
  }
}

// Enhanced API client with performance tracking
export const createApiClient = (baseUrl: string) => {
  const performanceMonitor = PerformanceMonitor.getInstance();

  return {
    async request(endpoint: string, options: RequestInit = {}) {
      const startTime = performance.now();
      
      try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        const duration = performance.now() - startTime;
        performanceMonitor.trackApiCall(endpoint, duration);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        const duration = performance.now() - startTime;
        performanceMonitor.trackApiCall(`${endpoint}_error`, duration);
        throw error;
      }
    }
  };
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  import('web-vitals').then((webVitals) => {
    webVitals.onCLS((metric) => {
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'CLS',
          value: Math.round(metric.value * 1000) / 1000,
          non_interaction: true,
        });
      }
    });

    webVitals.onFID((metric) => {
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'FID',
          value: Math.round(metric.value),
          non_interaction: true,
        });
      }
    });

    webVitals.onFCP((metric) => {
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'FCP',
          value: Math.round(metric.value),
          non_interaction: true,
        });
      }
    });

    webVitals.onLCP((metric) => {
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'LCP',
          value: Math.round(metric.value),
          non_interaction: true,
        });
      }
    });

    webVitals.onTTFB((metric) => {
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'TTFB',
          value: Math.round(metric.value),
          non_interaction: true,
        });
      }
    });
  });
};

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}