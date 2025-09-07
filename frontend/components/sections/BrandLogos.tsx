'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function BrandLogos() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  const brands = [
    { 
      name: "NIKE", 
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png",
      alt: "Nike Logo"
    },
    { 
      name: "ADIDAS", 
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
      alt: "Adidas Logo"
    },
    { 
      name: "UNDER ARMOUR", 
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Under-Armour-Logo.png",
      alt: "Under Armour Logo"
    },
    { 
      name: "PUMA", 
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Puma-Logo.png",
      alt: "Puma Logo"
    },
    { 
      name: "LULULEMON", 
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Lululemon-Logo.png",
      alt: "Lululemon Logo"
    },
    { 
      name: "NBA", 
      logo: "https://logos-world.net/wp-content/uploads/2020/04/air-jordan-logo.png",
      alt: "NBA Logo"
    },
  ];

  useEffect(() => {
    if (!logosRef.current) return;

    // Animate logos entrance
    gsap.fromTo(logosRef.current.children,
      { 
        y: 30, 
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3
      }
    );

    // Continuous scroll animation
    const scrollAnimation = gsap.to(logosRef.current, {
      x: -logosRef.current.scrollWidth / 2,
      duration: 20,
      ease: 'none',
      repeat: -1
    });

    return () => {
      scrollAnimation.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-white py-8 sm:py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        

        {/* Scrolling Brand Logos */}
        <div className="relative">
          <div 
            ref={logosRef}
            className="flex space-x-8 sm:space-x-12 lg:space-x-16 items-center"
            style={{ width: '200%' }}
          >
            {/* First set of logos */}
            {brands.map((brand, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 group cursor-pointer"
              >
                <img
                  src={brand.logo}
                  alt={brand.alt}
                  className="h-8 sm:h-10 lg:h-12 w-auto filter brightness-0 group-hover:opacity-70 transition-all duration-300"
                  style={{ filter: 'brightness(0) saturate(100%)' }}
                />
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {brands.map((brand, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 group cursor-pointer"
              >
                <img
                  src={brand.logo}
                  alt={brand.alt}
                  className="h-8 sm:h-10 lg:h-12 w-auto filter brightness-0 group-hover:opacity-70 transition-all duration-300"
                  style={{ filter: 'brightness(0) saturate(100%)' }}
                />
              </div>
            ))}
          </div>

          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>

        {/* Additional Info */}
        {/* <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Over 50+ premium brands available
          </p>
        </div> */}
      </div>
    </div>
  );
}
