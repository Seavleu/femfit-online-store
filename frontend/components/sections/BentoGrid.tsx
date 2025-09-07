'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const bentoItems = [
  {
    id: 1,
    title: 'Artisan Crafted',
    description: 'Every piece is meticulously handcrafted by master artisans',
    image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
    size: 'large',
    span: 'col-span-2 row-span-2'
  },
  {
    id: 2,
    title: 'Premium Materials',
    description: 'Sourced from the finest suppliers worldwide',
    image: 'https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg',
    size: 'medium',
    span: 'col-span-1 row-span-1'
  },
  {
    id: 3,
    title: 'Timeless Design',
    description: 'Classic aesthetics that never go out of style',
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    size: 'medium',
    span: 'col-span-1 row-span-1'
  },
  {
    id: 4,
    title: 'Global Shipping',
    description: 'Worldwide delivery with white-glove service',
    size: 'small',
    span: 'col-span-1 row-span-1',
    color: 'bg-black text-white'
  },
  {
    id: 5,
    title: 'Lifetime Warranty',
    description: 'Comprehensive coverage for peace of mind',
    size: 'small',
    span: 'col-span-1 row-span-1',
    color: 'bg-gray-100'
  }
];

export default function BentoGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!gridRef.current) return;

    itemsRef.current.forEach((item, index) => {
      if (!item) return;

      gsap.fromTo(item,
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);

  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-playfair font-bold tracking-tight mb-6 leading-[0.9]">
            The FEMFIT Experience
          </h2>
          <p className="body-text text-lg text-gray-600 max-w-2xl mx-auto">
            Immerse yourself in a world where every detail matters and 
            exceptional quality is the standard.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-1 auto-rows-[200px] md:auto-rows-[250px] md:overflow-x-auto md:snap-x md:snap-mandatory"
        >
          {bentoItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) itemsRef.current[index] = el;
              }}
              className={`
                relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02]
                ${item.span}
                ${item.color || 'bg-luxury-sand border border-gray-200'}
                ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                ${item.size === 'medium' ? 'md:col-span-1 md:row-span-1' : ''}
                group cursor-pointer md:snap-start md:flex-shrink-0
              `}
            >
              {item.image && (
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                </div>
              )}
              
              <div className={`relative z-10 h-full flex flex-col justify-end ${item.image ? 'text-white' : ''}`}>
                <h3 className={`text-xl md:text-2xl font-space-grotesk font-bold mb-2 ${item.size === 'large' ? 'md:text-3xl' : ''}`}>
                  {item.title}
                </h3>
                <p className={`body-text text-sm md:text-base opacity-90 ${item.size === 'large' ? 'md:text-lg' : ''}`}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}