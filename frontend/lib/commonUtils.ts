import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

/**
 * Common utility functions to eliminate code duplication
 */

// Role checking utilities
export const useRoleCheck = () => {
  const { user } = useSupabaseAuth();
  
  const isAdmin = () => user?.user_metadata?.role === 'admin';
  const isShopper = () => user?.user_metadata?.role === 'shopper';
  const isAuthenticated = () => !!user;
  const getUserRole = () => user?.user_metadata?.role || 'guest';
  const getUserId = () => user?.id;
  
  return {
    isAdmin,
    isShopper,
    isAuthenticated,
    getUserRole,
    getUserId,
    user,
  };
};

// Navigation utilities
export const getNavigationLinks = (userRole: string) => {
  const baseLinks = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/shop', label: 'Shop', icon: 'shopping-bag' },
    { href: '/about', label: 'About', icon: 'info' },
    { href: '/contact', label: 'Contact', icon: 'mail' },
  ];

  const roleBasedLinks = {
    admin: [
      { href: '/admin/dashboard', label: 'Admin Dashboard', icon: 'settings' },
      { href: '/admin/products', label: 'Manage Products', icon: 'package' },
      { href: '/admin/orders', label: 'Manage Orders', icon: 'list' },
    ],
    shopper: [
      { href: '/dashboard', label: 'Dashboard', icon: 'user' },
      { href: '/profile', label: 'Profile', icon: 'user-circle' },
      { href: '/orders', label: 'My Orders', icon: 'shopping-cart' },
      { href: '/wishlist', label: 'Wishlist', icon: 'heart' },
    ],
  };

  return {
    baseLinks,
    roleLinks: roleBasedLinks[userRole as keyof typeof roleBasedLinks] || [],
  };
};

// Form validation utilities
export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]{10,}$/,
    message: 'Please enter a valid phone number',
  },
  required: (value: any) => !!value || 'This field is required',
  minLength: (min: number) => (value: string) => 
    value.length >= min || `Minimum length is ${min} characters`,
  maxLength: (max: number) => (value: string) => 
    value.length <= max || `Maximum length is ${max} characters`,
};

// Date and time utilities
export const dateUtils = {
  formatDate: (date: Date | string, options: Intl.DateTimeFormatOptions = {}) => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
  },
  
  formatRelativeTime: (date: Date | string) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return dateUtils.formatDate(date, { month: 'short', day: 'numeric' });
  },
  
  isToday: (date: Date | string) => {
    const today = new Date();
    const targetDate = new Date(date);
    return today.toDateString() === targetDate.toDateString();
  },
  
  isThisWeek: (date: Date | string) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = Math.abs(today.getTime() - targetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  },
};

// String utilities
export const stringUtils = {
  capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
  
  truncate: (str: string, length: number, suffix: string = '...') => 
    str.length > length ? str.substring(0, length) + suffix : str,
  
  slugify: (str: string) => 
    str.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, ''),
  
  generateId: (prefix: string = 'id') => 
    `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  formatNumber: (num: number, locale: string = 'en-US') => 
    new Intl.NumberFormat(locale).format(num),
};

// Array utilities
export const arrayUtils = {
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
  
  groupBy: <T, K extends string | number>(
    array: T[],
    key: keyof T | ((item: T) => K)
  ): Record<K, T[]> => {
    return array.reduce((groups, item) => {
      const groupKey = typeof key === 'function' ? key(item) : item[key] as K;
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  },
  
  unique: <T>(array: T[], key?: keyof T): T[] => {
    if (!key) return [...new Set(array)];
    
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  },
  
  sortBy: <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  // Remove duplicates from array
  removeDuplicates: <T>(array: T[], key?: keyof T): T[] => {
    if (!key) return Array.from(new Set(array));
    
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  },

  // Pick specific keys from object
  pick: <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
  },
};

// Object utilities
export const objectUtils = {
  omit: <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  },
  
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as T;
    if (obj instanceof Array) return obj.map(item => objectUtils.deepClone(item)) as T;
    if (typeof obj === 'object') {
      const cloned = {} as T;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = objectUtils.deepClone(obj[key]);
        }
      }
      return cloned;
    }
    return obj;
  },
  
  isEmpty: (obj: any): boolean => {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
  },
};

// Local storage utilities
export const storageUtils = {
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultValue || null;
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  },
};

// Debounce and throttle utilities
export const timingUtils = {
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  },
  
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): T => {
    let inThrottle: boolean;
    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },
};

export default {
  useRoleCheck,
  getNavigationLinks,
  validationRules,
  dateUtils,
  stringUtils,
  arrayUtils,
  objectUtils,
  storageUtils,
  timingUtils,
};
