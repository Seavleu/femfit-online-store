'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { LAYOUT_CONSTANTS, RESPONSIVE } from '@/lib/layout';

interface Shoe {
  id: string;
  name: string;
  image: string;
  href: string;
}

export default function MostWantedShoesSection() {
  const shoes: Shoe[] = [
    {
      id: '1',
      name: 'Pointed Slingback Pump - Black',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
      href: '/shop/women/shoes?category=pumps'
    },
    {
      id: '2',
      name: 'Mary Jane Flats - Brown',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop',
      href: '/shop/women/shoes?category=flats'
    },
    {
      id: '3',
      name: 'Ankle Boots - Black',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300&h=300&fit=crop',
      href: '/shop/women/shoes?category=boots'
    },
    {
      id: '4',
      name: 'Sneakers - White',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
      href: '/shop/women/shoes?category=sneakers'
    },
    {
      id: '5',
      name: 'Heeled Sandals - Nude',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop',
      href: '/shop/women/shoes?category=sandals'
    }
  ];

  return (
    <section className={`${LAYOUT_CONSTANTS.SECTION_PADDING} bg-white`}>
      <div className={`${LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH} mx-auto ${LAYOUT_CONSTANTS.CONTAINER_PADDING}`}>
        <h2 className={`${LAYOUT_CONSTANTS.TEXT_3XL} font-bold text-black mb-8`}>Most Wanted: Shoes</h2>
        
        <div className={`${RESPONSIVE.GRID_5} ${LAYOUT_CONSTANTS.GAP_MEDIUM}`}>
          {shoes.map((shoe) => (
            <Link
              key={shoe.id}
              href={shoe.href}
              className="group cursor-pointer"
            >
              <div className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="aspect-square">
                  <img
                    src={shoe.image}
                    alt={shoe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Add to Cart Button */}
                  <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50">
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                    {shoe.name}
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
