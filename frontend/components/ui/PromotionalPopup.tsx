'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';

export default function PromotionalPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Check if user has already seen the popup
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('promoPopupSeen');
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Animate popup entrance
  useEffect(() => {
    if (isVisible) {
      const popupElement = document.querySelector('.promo-popup');
      if (popupElement) {
        gsap.fromTo(popupElement,
          { 
            scale: 0.8, 
            opacity: 0,
            y: 20
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
          }
        );
      }
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsClosing(true);
    
    const popupElement = document.querySelector('.promo-popup');
    if (popupElement) {
      gsap.to(popupElement, {
        scale: 0.8,
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setIsVisible(false);
          localStorage.setItem('promoPopupSeen', 'true');
        }
      });
    } else {
      setIsVisible(false);
      localStorage.setItem('promoPopupSeen', 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        {/* Popup */}
        <div className="promo-popup bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            disabled={isClosing}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Main offer */}
            <div className="mb-6">
              <h2 className="text-4xl font-bold text-red-600 mb-2 font-futura">
                80% OFF
              </h2>
              <p className="text-gray-600 text-sm font-light">
                T&CS APPLY
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-800 text-lg font-light mb-6">
              Don't miss out on our biggest sale of the year!
            </p>

            {/* CTA Button */}
            <button
              onClick={handleClose}
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              Shop Now
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-500 mt-4">
              *Terms and conditions apply. Limited time offer.
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-yellow-100 rounded-full opacity-20"></div>
        </div>
      </div>
    </>
  );
}
