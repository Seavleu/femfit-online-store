'use client';

import { useEffect, useRef } from 'react';
import { ShoppingBag } from 'lucide-react';
// GSAP removed - using CSS animations instead
import { useCart } from '@/contexts/CartContext';

export default function CartIcon() {
  const { state, toggleCart } = useCart();
  const iconRef = useRef<HTMLButtonElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Animate cart icon when items are added
    if (state.itemCount > 0 && iconRef.current) {
      iconRef.current.classList.add('animate-bounce');
    }
  }, [state.itemCount]);

  useEffect(() => {
    // Animate badge when count changes
    if (badgeRef.current && state.itemCount > 0) {
      badgeRef.current.classList.add('animate-scale-in');
    }
  }, [state.itemCount]);

  const handleClick = () => {
    toggleCart();
    
    // Click animation
    if (iconRef.current) {
      iconRef.current.classList.add('animate-pulse');
    }
  };

  return (
    <button
      ref={iconRef}
      onClick={handleClick}
      className="relative p-2 hover:text-luxury-gold transition-colors"
    >
      <ShoppingBag className="w-5 h-5" />
      {state.itemCount > 0 && (
        <span
          ref={badgeRef}
          className="absolute -top-1 -right-1 w-5 h-5 bg-luxury-gold text-white text-xs font-bold rounded-full flex items-center justify-center"
        >
          {state.itemCount > 99 ? '99+' : state.itemCount}
        </span>
      )}
    </button>
  );
}