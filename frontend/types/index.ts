// Common types used across the application
export interface Product {
  id: string;
  name: string;
  price: {
    usd: number;
    khr: number;
  };
  image: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  category: string;
  description?: string;
  isNew?: boolean;
  rating?: number;
  reviews?: number;
  stock?: number;
  tags?: string[];
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user' | 'seller';
  avatar?: string;
  preferences?: {
    language: 'en' | 'km';
    currency: 'USD' | 'KHR';
    notifications: boolean;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'promo' | 'system' | 'wishlist';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  query?: string;
  category?: string[];
  priceRange?: [number, number];
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  rating?: number;
  availability?: 'in-stock' | 'out-of-stock' | 'all';
}

export interface TMarqueeProps {
  title: string;
  className?: string;
}

export interface TRoundedProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
  [key: string]: any;
}