'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { toast } from 'sonner';

// Define Product interface locally to avoid circular dependencies
export interface Product {
  id: number;
  name: string;
  price: {
    usd: number;
    khr: number;
  };
  image: string;
  description: string;
  category: string;
  tags: string[];
  sizes: string[];
  images: string[];
  colors?: string[];
  originalPrice?: {
    usd: number;
    khr: number;
  };
  rating?: number;
  reviews?: number;
  material: string;
  care: string[];
  details: string;
  stock?: number;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;
  isLoading: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; selectedSize?: string; selectedColor?: string } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
  isLoading: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, selectedSize, selectedColor } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`Updated ${product.name} quantity in cart`);
      } else {
        const newItem: CartItem = {
          id: Date.now(),
          product,
          quantity,
          selectedSize,
          selectedColor,
        };
        newItems = [...state.items, newItem];
        toast.success(`${product.name} added to cart`);
      }

      const total = newItems.reduce((sum, item) => {
        const price = item.product.price.usd;
        return sum + (price * item.quantity);
      }, 0);

      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      const newItems = state.items.filter(item => item.id !== action.payload);
      
      if (itemToRemove) {
        toast.success(`${itemToRemove.product.name} removed from cart`);
      }

      const total = newItems.reduce((sum, item) => {
        const price = item.product.price.usd;
        return sum + (price * item.quantity);
      }, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      const total = newItems.reduce((sum, item) => {
        const price = item.product.price.usd;
        return sum + (price * item.quantity);
      }, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };

    case 'LOAD_CART':
      const total = action.payload.reduce((sum, item) => {
        const price = item.product.price.usd;
        return sum + (price * item.quantity);
      }, 0);
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: action.payload,
        total,
        itemCount,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  addToCart: (product: Product, quantity: number, selectedSize?: string, selectedColor?: string) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
} | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('femfit-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          dispatch({ type: 'LOAD_CART', payload: parsedCart.items });
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('femfit-cart', JSON.stringify({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount
      }));
    } else {
      localStorage.removeItem('femfit-cart');
    }
  }, [state.items, state.total, state.itemCount]);

  const addToCart = async (product: Product, quantity: number, selectedSize?: string, selectedColor?: string) => {
    // Update local state immediately
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity, selectedSize, selectedColor }
    });
  };

  const removeFromCart = async (itemId: number) => {
    // Update local state immediately
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    // Update local state immediately
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  const clearCart = async () => {
    // Update local state immediately
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });

  const value = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}