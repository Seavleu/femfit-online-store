'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

export default function PromotionalBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentPromo, setCurrentPromo] = useState(0);

  const promotionalData = [
    {
      id: 1,
      title: "SALE UP TO",
      discount: "80% OFF",
      disclaimer: "T&CS APPLY",
      leftButton: "SHOP MEN",
      rightButton: "SHOP WOMEN",
      anniversary: "20 YEARS ANNIVERSARY",
      // brands: ["ZANDO.", "TEN ELEVEN", "GATONI", "ROUTINE", "361°", "SISBURMA"]
    },
    {
      id: 2,
      title: "NEW COLLECTION",
      discount: "50% OFF",
      disclaimer: "LIMITED TIME",
      leftButton: "SHOP WOMEN",
      rightButton: "SHOP MEN",
      anniversary: "FEMFIT PREMIUM",
      // brands: ["NIKE", "ADIDAS", "UNDER ARMOUR", "PUMA", "REEBOK", "NEW BALANCE"]
    },
    {
      id: 3,
      title: "WINTER SALE",
      discount: "70% OFF",
      disclaimer: "WHILE STOCKS LAST",
      leftButton: "SHOP NOW",
      rightButton: "VIEW ALL",
      anniversary: "SEASONAL DROP",
      // brands: ["CHAMPION", "FILA", "CONVERSE", "VANS", "ASICS", "BROOKS"]
    }
  ];

  // Auto-rotate promotional content
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotionalData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animate banner entrance
  useEffect(() => {
    if (isVisible) {
      gsap.fromTo('.promo-banner',
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [isVisible]);

  const currentData = promotionalData[currentPromo];

  if (!isVisible) return null;

  return (
    <div className="promo-banner relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 overflow-hidden">
      {/* Decorative Ribbon Elements */}
      {/* <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div> */}
      {/* <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div> */}
      
      {/* Swirling Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-200">
          <path d="M20,20 Q50,5 80,20 Q95,50 80,80 Q50,95 20,80 Q5,50 20,20" 
                fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-200">
          <path d="M30,10 Q70,10 70,50 Q70,90 30,90 Q10,90 10,50 Q10,10 30,10" 
                fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Top Row - Anniversary & Brands */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            {/* Anniversary Badge */}
            <div className="mb-4 lg:mb-0">
              <div className="bg-yellow-400 text-red-800 px-4 py-2 rounded-lg font-bold text-sm sm:text-base">
                <div className="text-2xl font-black">20</div>
                <div className="text-xs">YEARS ANNIVERSARY</div>
              </div>
            </div>

            {/* Brand List */}
            {/* <div className="flex flex-wrap gap-4 lg:gap-6 text-white text-xs sm:text-sm font-medium">
              {currentData.brands.map((brand, index) => (
                <span 
                  key={index}
                  className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {brand}
                </span>
              ))}
            </div> */}
          </div>

          {/* Main Promotional Content */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-100 mb-2">
                {currentPromo === 0 ? (
                  <>
                    <span className="block">SALE UP TO</span>
                    <span className="block text-6xl sm:text-7xl lg:text-8xl text-yellow-200 font-black">
                      80% OFF
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block">{currentData.title}</span>
                    <span className="block text-4xl sm:text-5xl lg:text-6xl text-yellow-200 font-black">
                      {currentData.discount}
                    </span>
                  </>
                )}
              </h1>
              <p className="text-yellow-200 text-sm sm:text-base font-medium">
                {currentData.disclaimer}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-white text-red-700 border-2 border-white px-6 py-3 sm:px-8 sm:py-4 font-bold text-sm sm:text-base hover:bg-red-700 hover:text-white transition-all duration-300 hover:scale-105 flex items-center">
                {currentData.leftButton}
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group bg-transparent text-white border-2 border-white px-6 py-3 sm:px-8 sm:py-4 font-bold text-sm sm:text-base hover:bg-white hover:text-red-700 transition-all duration-300 hover:scale-105 flex items-center">
                {currentData.rightButton}
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Promotional Dots Indicator */}
          <div className="flex justify-center space-x-2">
            {promotionalData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPromo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentPromo 
                    ? "bg-yellow-300 scale-125" 
                    : "bg-yellow-200/50 hover:bg-yellow-200/75"
                )}
              />
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
