'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { LAYOUT_CONSTANTS, RESPONSIVE } from '@/lib/layout';

interface Bag {
  id: string;
  name: string;
  image: string;
  href: string;
}

export default function MostWantedBagsSection() {
  const bags: Bag[] = [
    {
      id: '1',
      name: 'Calla Tote Bag - Espresso Brown',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      href: '/shop/women/bags?category=tote'
    },
    {
      id: '2',
      name: 'Agatha Chain-Accent Shoulder Bag - Black',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop',
      href: '/shop/women/bags?category=shoulder'
    },
    {
      id: '3',
      name: 'Carey Crescent Hobo Bag - Oat',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      href: '/shop/women/bags?category=hobo'
    },
    {
      id: '4',
      name: 'Aubrielle Metallic-Buckle Top Handle Bag - Black',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop',
      href: '/shop/women/bags?category=top-handle'
    },
    {
      id: '5',
      name: 'Aubrielle Croc-Effect Bag - Black',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      href: '/shop/women/bags?collection=aubrielle'
    }
  ];

  return (
    <section className={`${LAYOUT_CONSTANTS.SECTION_PADDING} bg-gray-50`}>
      <div className={`${LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH} mx-auto ${LAYOUT_CONSTANTS.CONTAINER_PADDING}`}>
        <h2 className={`${LAYOUT_CONSTANTS.TEXT_3XL} font-bold text-black mb-8`}>Most Wanted: Bags</h2>
        
        <div className={`${RESPONSIVE.GRID_5} ${LAYOUT_CONSTANTS.GAP_MEDIUM}`}>
          {bags.map((bag) => (
            <Link
              key={bag.id}
              href={bag.href}
              className="group cursor-pointer"
            >
              <div className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="aspect-square">
                  <img
                    src={bag.image}
                    alt={bag.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Add to Cart Button */}
                  <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50">
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                    {bag.name}
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
