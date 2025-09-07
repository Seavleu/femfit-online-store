'use client';

import { toast } from 'sonner';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ProductsResponse {
  products: any[];
  pagination?: any;
}

interface CartResponse {
  cart: any;
  message?: string;
}

interface OrderResponse {
  order: any;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      // Show toast notification for user feedback
      if (typeof window !== 'undefined') {
        toast.error(errorMessage);
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Product endpoints
  async getProducts(params?: Record<string, any>): Promise<ApiResponse<ProductsResponse>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<ProductsResponse>(`/products${queryString}`);
  }

  async getProduct(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/products/${id}`);
  }

  // Cart endpoints
  async getCart(): Promise<ApiResponse<CartResponse>> {
    return this.request<CartResponse>('/cart');
  }

  async addToCart(productId: string, quantity: number, options?: any): Promise<ApiResponse<CartResponse>> {
    return this.request<CartResponse>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, ...options }),
    });
  }

  async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<CartResponse>> {
    return this.request<CartResponse>('/cart', {
      method: 'PUT',
      body: JSON.stringify({ itemId, quantity }),
    });
  }

  async removeFromCart(itemId: string): Promise<ApiResponse<CartResponse>> {
    return this.request<CartResponse>('/cart', {
      method: 'DELETE',
      body: JSON.stringify({ itemId }),
    });
  }

  async clearCart(): Promise<ApiResponse<CartResponse>> {
    return this.request<CartResponse>('/cart', {
      method: 'DELETE',
    });
  }

  // Order endpoints
  async createOrder(orderData: any): Promise<ApiResponse<OrderResponse>> {
    return this.request<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(params?: Record<string, any>): Promise<ApiResponse<any[]>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any[]>(`/orders${queryString}`);
  }

  async getOrder(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/orders/${id}`);
  }

  // Wishlist endpoints
  async getWishlist(): Promise<ApiResponse<any>> {
    return this.request<any>('/wishlist');
  }

  async addToWishlist(productId: string): Promise<ApiResponse<any>> {
    return this.request<any>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/wishlist?productId=${productId}`, {
      method: 'DELETE',
    });
  }

  // User endpoints
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request<any>('/dashboard');
  }

  async updateUserProfile(profileData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/dashboard', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Newsletter subscription
  async subscribeToNewsletter(email: string): Promise<ApiResponse<any>> {
    return this.request<any>('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Payment endpoints
  async createPaymentIntent(orderId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/orders/payment-intent/${orderId}`, {
      method: 'POST',
    });
  }

  async confirmPayment(paymentData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient();