'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gift, Percent } from 'lucide-react';
import NewsletterSignup from '@/components/marketing/NewsletterSignup';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function NewsletterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(sectionRef.current.children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-gradient-to-br from-luxury-charcoal via-black to-luxury-charcoal">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Gift className="w-6 h-6 text-luxury-gold" />
          <span className="text-luxury-gold font-medium tracking-wider uppercase text-sm">
            Exclusive Offer
          </span>
          <Gift className="w-6 h-6 text-luxury-gold" />
        </div>
        
        <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-white mb-6 leading-tight">
          Join the FEMFIT Community
        </h2>
        
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Be the first to discover new collections, exclusive events, and receive 
          <span className="text-luxury-gold font-semibold"> 15% off your first purchase</span>.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Percent className="w-6 h-6 text-luxury-gold" />
            </div>
            <h4 className="font-space-grotesk font-semibold text-white mb-2">Exclusive Discounts</h4>
            <p className="text-sm text-gray-400">Member-only pricing and early access sales</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6 text-luxury-gold" />
            </div>
            <h4 className="font-space-grotesk font-semibold text-white mb-2">First Access</h4>
            <p className="text-sm text-gray-400">Preview new collections before anyone else</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-luxury-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </div>
            <h4 className="font-space-grotesk font-semibold text-white mb-2">Curated Content</h4>
            <p className="text-sm text-gray-400">Style guides and luxury lifestyle tips</p>
          </div>
        </div>

        <NewsletterSignup variant="footer" />
        
        <p className="text-xs text-gray-500 mt-6">
          No spam, ever. Unsubscribe at any time. By subscribing, you agree to our Privacy Policy.
        </p>
      </div>
    </section>
  );
}