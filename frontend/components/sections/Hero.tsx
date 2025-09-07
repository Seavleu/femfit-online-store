'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useTranslation } from '@/lib/i18n';

const heroImages = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
];

const promoMessages = [
  'Free shipping on orders over $50',
  'New collection available now',
  'Limited time offer - 20% off',
];

export default function Hero() {
  const { user } = useSupabaseAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const promoRef = useRef<HTMLDivElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);

  // Auto-slide images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-change promo text every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Animate image transitions
  useEffect(() => {
    if (leftImageRef.current && rightImageRef.current) {
      gsap.fromTo([leftImageRef.current, rightImageRef.current], 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [currentImageIndex]);

  // Animate promo text changes
  useEffect(() => {
    if (promoRef.current) {
      gsap.fromTo(promoRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [currentPromoIndex]);

  const { t } = useTranslation();

  return (
    <section ref={heroRef} className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Promo Banner */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black text-white py-2 text-center text-sm">
        <div ref={promoRef} className="flex items-center justify-center space-x-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>{promoMessages[currentPromoIndex]}</span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={user ? '/shop' : '/auth/signin'}
              className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 group"
            >
              {user ? t('hero.shop_now') : t('hero.get_started')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            {!user && (
              <Link
                href="/shop"
                className="inline-flex items-center px-8 py-4 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-colors duration-200"
              >
                {t('hero.browse_products')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          {/* Left Image */}
          <div
            ref={leftImageRef}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1/3 h-2/3 opacity-20"
            style={{
              backgroundImage: `url(${heroImages[currentImageIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Right Image */}
          <div
            ref={rightImageRef}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3 h-2/3 opacity-20"
            style={{
              backgroundImage: `url(${heroImages[(currentImageIndex + 1) % heroImages.length]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}