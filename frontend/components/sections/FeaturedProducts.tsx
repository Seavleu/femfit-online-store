'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = [
  {
    id: 1,
    name: 'BEST SELLER',
    image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg', // Black heels
    href: '/shop?category=best-seller'
  },
  {
    id: 2,
    name: 'NEW ARRIVALS',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', // Black tote bag
    href: '/shop?category=new-arrivals'
  },
  {
    id: 3,
    name: 'SHOES',
    image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg', // Pink flats
    href: '/shop?category=shoes'
  },
  {
    id: 4,
    name: 'BAGS',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', // Black drawstring bag
    href: '/shop?category=bags'
  },
  {
    id: 5,
    name: 'MARY JANES',
    image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg', // Burgundy Mary Janes
    href: '/shop?category=mary-janes'
  },
  {
    id: 6,
    name: 'SHOULDER BAGS',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', // Pink quilted bag
    href: '/shop?category=shoulder-bags'
  }
];

export default function CategoryGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Staggered fade-in animation
      gsap.fromTo(card,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Subtle hover animations
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { 
          y: -5, 
          boxShadow: '0 8px 25px rgba(0,0,0,0.12)', 
          duration: 0.3, 
          ease: 'power2.out' 
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { 
          y: 0, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
          duration: 0.3, 
          ease: 'power2.out' 
        });
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={category.href}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group block w-full"
            >
              <div className="bg-gray-50 rounded-none overflow-hidden shadow-sm transition-all duration-300 aspect-square flex flex-col">
                {/* Product Image Container */}
                <div className="flex-1 flex items-center justify-center p-6 bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover max-w-32 max-h-32 lg:max-w-36 lg:max-h-36"
                  />
                </div>
                
                {/* Category Label */}
                <div className="bg-gray-50 py-4 px-3 text-center">
                  <h3 className="text-xs lg:text-sm font-medium text-gray-900 uppercase tracking-wide leading-tight">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}