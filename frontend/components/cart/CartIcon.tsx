'use client';

import { useEffect, useRef } from 'react';
import { ShoppingBag } from 'lucide-react';
import gsap from 'gsap';
import { useCart } from '@/contexts/CartContext';

export default function CartIcon() {
  const { state, toggleCart } = useCart();
  const iconRef = useRef<HTMLButtonElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Animate cart icon when items are added
    if (state.itemCount > 0 && iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
  }, [state.itemCount]);

  useEffect(() => {
    // Animate badge when count changes
    if (badgeRef.current && state.itemCount > 0) {
      gsap.fromTo(badgeRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [state.itemCount]);

  const handleClick = () => {
    toggleCart();
    
    // Click animation
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
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