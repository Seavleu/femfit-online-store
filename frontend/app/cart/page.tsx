'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/currency';

export default function CartPage() {
  const { state, updateQuantity, removeFromCart } = useCart();

  const handleUpdateQuantity = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };

  const { clearCart } = useCart();

  if (state.items.length === 0) {
    return (
      <main className="bg-white text-black min-h-screen">
        <Navigation />
        <div className="max-w-2xl mx-auto px-6 sm:px-8 pt-24 pb-16 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-playfair font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-8 py-4 font-medium hover:bg-gray-900 transition-colors rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-white text-black min-h-screen">
      <Navigation />
      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/shop"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-playfair font-bold">Shopping Cart</h1>
          <span className="text-gray-500">({state.itemCount} items)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-space-grotesk font-semibold">Items in your cart</h2>
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-6">
              {state.items.map((item) => (
                <div key={item.id} className="flex space-x-4 p-6 border border-gray-200 rounded-lg">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-space-grotesk font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.category}</p>
                        {item.selectedSize && (
                          <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="space-y-1">
                          <p className="font-space-grotesk font-bold">{formatPrice(item.product.price, 'USD')}</p>
                          <p className="text-xs text-gray-500">{formatPrice(item.product.price, 'KHR')}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          ${(item.product.price.usd * item.quantity).toFixed(2)} total
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
              <h3 className="text-lg font-space-grotesk font-semibold mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({state.itemCount} items)</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(state.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-space-grotesk font-bold">
                    <span>Total</span>
                    <span>${(state.total + state.total * 0.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-black text-white py-4 px-6 font-medium text-center block hover:bg-gray-900 transition-colors"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  href="/shop"
                  className="w-full border border-gray-200 py-4 px-6 font-medium text-center block hover:border-black transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Free shipping on orders over $100
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}