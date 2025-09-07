'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';

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
      // Animate in on first load
      const promoBarElement = document.querySelector('.promo-bar-container');
      if (promoBarElement) {
        gsap.fromTo(promoBarElement, 
          { 
            y: -38, 
            opacity: 0 
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.2 // Small delay for a polished feel
          }
        );
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
      gsap.fromTo(messageElement,
        { 
          opacity: 0, 
          y: -20,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out'
        }
      );
    }
  }, [currentMessage, isVisible]);

  // Handle close button click
  const handleClose = () => {
    setIsClosing(true);
    
    // Animate the closing
    const promoBarElement = document.querySelector('.promo-bar-container');
    if (promoBarElement) {
      gsap.to(promoBarElement, {
        y: -38, // Slide up by its height
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsVisible(false);
          localStorage.setItem('promoBarClosed', 'true');
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('promoBarClosed'));
        }
      });
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

