'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
// GSAP removed - using CSS animations instead

export default function AnimatedPromoBar() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const promotionalMessages = [
    "Free shipping on orders over $50 | New arrivals now available",
    "Sign up to save points and unlock exclusive rewards",
    "20% off your first order | Use code WELCOME20",
    "Flash sale: Up to 50% off - Ends tonight!",
  ];

  // Check localStorage on mount to see if user previously closed the promo bar
  useEffect(() => {
    const isPromoBarClosed = localStorage.getItem('promoBarClosed');
    if (isPromoBarClosed === 'true') {
      setIsVisible(false);
    } else {
      // Add CSS animation classes
      const promoBarElement = document.querySelector('.promo-bar-container');
      if (promoBarElement) {
        promoBarElement.classList.add('animate-slide-in-down');
      }
    }
  }, []);

  // Auto-rotate messages
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % promotionalMessages.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isVisible, promotionalMessages.length]);

  // Animate message transitions
  useEffect(() => {
    if (!isVisible) return;
    
    const messageElement = document.querySelector('.promo-message');
    if (messageElement) {
      messageElement.classList.add('animate-fade-in');
    }
  }, [currentMessage, isVisible]);

  // Handle close button click
  const handleClose = () => {
    setIsClosing(true);
    
    // Add CSS animation classes for closing
    const promoBarElement = document.querySelector('.promo-bar-container');
    if (promoBarElement) {
      promoBarElement.classList.add('animate-slide-out-up');
      
      // Close after animation
      setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem('promoBarClosed', 'true');
        window.dispatchEvent(new CustomEvent('promoBarClosed'));
      }, 400);
    } else {
      // Fallback if element not found
      setIsVisible(false);
      localStorage.setItem('promoBarClosed', 'true');
      window.dispatchEvent(new CustomEvent('promoBarClosed'));
    }
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="promo-bar-container fixed top-0 left-0 right-0 text-black text-center overflow-hidden bg-secondary shadow-lg z-50"
      style={{ 
        height: '38px',
        backgroundColor: 'var(--secondary)'
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-[38px] bg-gradient-to-r from-transparent via-amber-50 to-transparent transform -skew-y-1 animate-pulse"></div>
      </div>
      
      <div className="relative flex items-center justify-center h-full">
        <div className="promo-message px-1">
          <p className="tracking-wide font-futura text-[15px] font-thin">
            {promotionalMessages[currentMessage]}
          </p>
        </div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors duration-200 hover:scale-110"
          aria-label="Close promotional message"
          disabled={isClosing}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

