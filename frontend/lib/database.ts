/**
 * SERVER-SIDE ONLY - DO NOT IMPORT IN CLIENT COMPONENTS
 * 
 * This file contains database operations that should only be executed
 * on the server side. Importing this in client components will cause
 * bundling errors due to Node.js dependencies.
 */

import { supabase } from './supabase';

// Type definitions for database operations
export interface ProductData {
  name: string;
  price: number;
  description: string;
  category: string;
  tags: string[];
  sizes: string[];
  material?: string;
  care?: string[];
  stock: number;
  image?: string;
  images?: string[];
  colors?: string[];
  isActive?: boolean;
}

export interface OrderData {
  user_id: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status?: string;
}

export interface UserData {
  email: string;
  name: string;
  role?: 'admin' | 'shopper';
  image?: string;
  googleId?: string;
}

export interface DatabaseResult<T> {
  data: T | null;
  error: any;
}

// Product operations
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getProduct = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();
  
  return { data, error };
};

export const createProduct = async (productData: any) => {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();
  
  return { data, error };
};

export const updateProduct = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

export const deleteProduct = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  return { data, error };
};

// Order operations
export const getOrders = async (userId?: string) => {
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `);
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const createOrder = async (orderData: any) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  
  return { data, error };
};

export const updateOrderStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

// User operations
export const getUser = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
};

export const updateUser = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

// Cart operations
export const getCart = async (userId: string) => {
  const { data, error } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
};

export const updateCart = async (userId: string, items: any[]) => {
  const { data, error } = await supabase
    .from('carts')
    .upsert({ 
      user_id: userId, 
      items, 
      updated_at: new Date().toISOString() 
    })
    .select()
    .single();
  
  return { data, error };
};

// Wishlist operations
export const getWishlist = async (userId: string) => {
  const { data, error } = await supabase
    .from('wishlists')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
};

export const updateWishlist = async (userId: string, items: any[]) => {
  const { data, error } = await supabase
    .from('wishlists')
    .upsert({ 
      user_id: userId, 
      items, 
      updated_at: new Date().toISOString() 
    })
    .select()
    .single();
  
  return { data, error };
};
