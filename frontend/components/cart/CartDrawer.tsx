'use client';

import { useEffect, useRef } from 'react';
import { X, Plus, Minus, ShoppingBag, Truck } from 'lucide-react';
// GSAP removed - using CSS animations instead
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/currency';

export default function CartDrawer() {
  const { state, updateQuantity, removeFromCart, closeCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.isOpen) {
      // Add CSS animation classes
      if (overlayRef.current && drawerRef.current && contentRef.current) {
        overlayRef.current.classList.add('animate-fade-in');
        drawerRef.current.classList.add('animate-slide-in-right');
        
        // Add staggered animation to children
        Array.from(contentRef.current.children).forEach((child, index) => {
          child.classList.add('animate-fade-in');
          (child as HTMLElement).style.animationDelay = `${0.2 + index * 0.05}s`;
        });
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [state.isOpen]);

  const handleClose = () => {
    if (overlayRef.current && drawerRef.current) {
      // Add CSS animation classes for closing
      drawerRef.current.classList.add('animate-slide-out-right');
      overlayRef.current.classList.add('animate-fade-out');
      
      // Close after animation
      setTimeout(() => {
        closeCart();
      }, 300);
    }
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
      >
        <div ref={contentRef} className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="text-lg font-space-grotesk font-semibold">
                Shopping Cart ({state.itemCount})
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link
                  href="/shop"
                  onClick={handleClose}
                  className="inline-block bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="font-space-grotesk font-medium text-sm">
                        {item.product.name}
                      </h3>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                      )}
                      {item.selectedColor && (
                        <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>
                      )}
                      <p className="font-space-grotesk font-bold text-sm">
                        {formatPrice(item.product.price, 'USD')}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-2 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-100 p-6 space-y-4">
              {/* Delivery Info */}
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-luxury-gold" />
                <span>Estimated delivery: {estimatedDelivery.toLocaleDateString()}</span>
              </div>
              
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-space-grotesk font-bold">
                <span>Total</span>
                <div className="text-right">
                  <div>${state.total.toFixed(2)}</div>
                  <div className="text-sm text-gray-500 font-normal">
                    ≈ {(state.total * 4100).toLocaleString()} KHR
                  </div>
                </div>
              </div>
              
              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={handleClose}
                className="w-full bg-black text-white py-4 px-6 font-medium text-center block hover:bg-gray-900 transition-colors"
              >
                Checkout
              </Link>
              
              <Link
                href="/shop"
                onClick={handleClose}
                className="w-full border border-gray-200 py-4 px-6 font-medium text-center block hover:border-black transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}