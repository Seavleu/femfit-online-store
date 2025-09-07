'use client';

// Mock analytics service - in production, this would integrate with Supabase
interface ProductAnalytics {
  productId: number;
  views: number;
  cartAdds: number;
  purchases: number;
  lastViewed: Date;
  category: string;
  tags: string[];
}

interface UserBehavior {
  userId?: string;
  sessionId: string;
  viewedProducts: number[];
  cartProducts: number[];
  purchasedProducts: number[];
  preferredCategories: string[];
  preferredTags: string[];
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private productAnalytics: Map<number, ProductAnalytics> = new Map();
  private userBehavior: UserBehavior;

  constructor() {
    this.userBehavior = {
      sessionId: this.generateSessionId(),
      viewedProducts: [],
      cartProducts: [],
      purchasedProducts: [],
      preferredCategories: [],
      preferredTags: []
    };
    this.loadFromStorage();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('luxe_analytics');
      if (stored) {
        const data = JSON.parse(stored);
        this.userBehavior = { ...this.userBehavior, ...data.userBehavior };
        
        // Load product analytics
        if (data.productAnalytics) {
          Object.entries(data.productAnalytics).forEach(([id, analytics]) => {
            this.productAnalytics.set(Number(id), analytics as ProductAnalytics);
          });
        }
      }
    } catch (error) {
      console.error('Error loading analytics from storage:', error);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        userBehavior: this.userBehavior,
        productAnalytics: Object.fromEntries(this.productAnalytics)
      };
      localStorage.setItem('luxe_analytics', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving analytics to storage:', error);
    }
  }

  // Track product view
  trackProductView(productId: number, category: string, tags: string[]) {
    // Update product analytics
    const existing = this.productAnalytics.get(productId) || {
      productId,
      views: 0,
      cartAdds: 0,
      purchases: 0,
      lastViewed: new Date(),
      category,
      tags
    };

    existing.views += 1;
    existing.lastViewed = new Date();
    this.productAnalytics.set(productId, existing);

    // Update user behavior
    if (!this.userBehavior.viewedProducts.includes(productId)) {
      this.userBehavior.viewedProducts.push(productId);
    }

    if (!this.userBehavior.preferredCategories.includes(category)) {
      this.userBehavior.preferredCategories.push(category);
    }

    tags.forEach(tag => {
      if (!this.userBehavior.preferredTags.includes(tag)) {
        this.userBehavior.preferredTags.push(tag);
      }
    });

    this.saveToStorage();
  }

  // Track add to cart
  trackAddToCart(productId: number) {
    const existing = this.productAnalytics.get(productId);
    if (existing) {
      existing.cartAdds += 1;
      this.productAnalytics.set(productId, existing);
    }

    if (!this.userBehavior.cartProducts.includes(productId)) {
      this.userBehavior.cartProducts.push(productId);
    }

    this.saveToStorage();
  }

  // Track purchase
  trackPurchase(productId: number) {
    const existing = this.productAnalytics.get(productId);
    if (existing) {
      existing.purchases += 1;
      this.productAnalytics.set(productId, existing);
    }

    if (!this.userBehavior.purchasedProducts.includes(productId)) {
      this.userBehavior.purchasedProducts.push(productId);
    }

    this.saveToStorage();
  }

  // Get trending products (most views + cart adds in last week)
  getTrendingProducts(limit: number = 6): number[] {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return Array.from(this.productAnalytics.values())
      .filter(analytics => analytics.lastViewed > weekAgo)
      .sort((a, b) => (b.views + b.cartAdds) - (a.views + a.cartAdds))
      .slice(0, limit)
      .map(analytics => analytics.productId);
  }

  // Get top purchased products (last 30 days)
  getTopPurchased(limit: number = 6): number[] {
    return Array.from(this.productAnalytics.values())
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, limit)
      .map(analytics => analytics.productId);
  }

  // Get personalized recommendations
  getPersonalizedRecommendations(allProducts: any[], limit: number = 6): number[] {
    const userCategories = this.userBehavior.preferredCategories;
    const userTags = this.userBehavior.preferredTags;
    const viewedProducts = this.userBehavior.viewedProducts;

    return allProducts
      .filter(product => !viewedProducts.includes(product.id))
      .filter(product => 
        userCategories.includes(product.category) ||
        product.tags.some((tag: string) => userTags.includes(tag))
      )
      .sort(() => Math.random() - 0.5) // Randomize for variety
      .slice(0, limit)
      .map(product => product.id);
  }

  // Get user behavior summary
  getUserBehavior(): UserBehavior {
    return { ...this.userBehavior };
  }

  // Set user ID when logged in
  setUserId(userId: string) {
    this.userBehavior.userId = userId;
    this.saveToStorage();
  }
}

export const analyticsService = AnalyticsService.getInstance();
export type { ProductAnalytics, UserBehavior };