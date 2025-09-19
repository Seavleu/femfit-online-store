'use client';

import { useEffect, useRef, useState } from 'react';
// GSAP removed - using CSS animations instead
import Link from 'next/link';

// GSAP removed - using CSS animations instead

const categories = [
  {
    id: 1,
    name: 'BOOTS',
    image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-ck-products/default/dw99335ae8/images/hi-res/2025-L3-CK1-60280474-01-1.jpg?sw=500&sh=667&sm=fit',
    href: '/shop?category=boots'
  },
  {
    id: 2,
    name: 'NEW ARRIVALS',
    image: 'https://www.charleskeith.com/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw31fceece/images/homepage/2025/charles-keith-home-opc-week-36-1-kr-500x667.jpg',
    href: '/shop?category=new-arrivals'
  },
  {
    id: 3,
    name: 'SHOES',
    image: 'https://www.charleskeith.com/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw0c5997b5/images/homepage/2025/charles-keith-home-opc-week-36-2-kr-500x667.jpg',
    href: '/shop?category=shoes'
  },
  {
    id: 4,
    name: 'SHOULDER BAGS',
    image: 'https://www.charleskeith.com/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw301a9ead/images/homepage/2025/charles-keith-home-opc-week-36-5-kr-500x667.jpg',
    href: '/shop?category=shoulder-bags'
  },
  {
    id: 5,
    name: 'LOAFERS',
    image: 'https://www.charleskeith.com/on/demandware.static/-/Library-Sites-CharlesKeith/default/dwdbf1903e/images/homepage/2025/charles-keith-home-opc-week-36-4-kr-500x667.jpg',
    href: '/shop?category=loafers'
  },
  {
    id: 6,
    name: 'HANDBAGS',
    image: 'https://www.charleskeith.com/on/demandware.static/-/Library-Sites-CharlesKeith/default/dwfa08e8f9/images/homepage/2025/charles-keith-home-opc-week-36-3-kr-500x667.jpg',
    href: '/shop?category=handbags'
  }
];

export default function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += 1;
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused]);

  useEffect(() => {
    if (!scrollRef.current) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Add CSS animation classes
      card.classList.add('animate-fade-in');
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }, []);

  // Duplicate categories for seamless scrolling
  const duplicatedCategories = [...categories, ...categories];

  return (
    <section className="py-2.5 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Grid View */}
                 <div className="block md:hidden">
           <div className="grid grid-cols-2 gap-0">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={category.href}
                className="group block"
                style={{ height: '423px' }}
              >
                <div className="relative w-full h-full overflow-hidden bg-white transition-all duration-300 border-2 border-transparent group-hover:border-black">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xs font-medium text-white text-center uppercase tracking-wide drop-shadow-lg">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Swipeable View */}
        <div className="hidden md:block">
                     <div 
             ref={scrollRef}
             className="flex gap-0 overflow-x-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
          {duplicatedCategories.map((category, index) => (
            <Link
              key={`${category.id}-${index}`}
              href={category.href}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group block flex-shrink-0"
              style={{ width: '317px', height: '423px' }}
            >
              <div className="relative w-full h-full overflow-hidden bg-neutral-50 transition-all duration-300 border-2 border-transparent group-hover:border-black">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute flex items-center justify-center bottom-6 left-6 right-6">
                  <h3 className="text-base font-futura font-thin text-black text-center uppercase tracking-wide drop-shadow-lg">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}