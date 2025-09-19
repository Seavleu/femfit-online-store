'use client';

import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import LinkHover from '@/animation/LinkHover';
import { Button } from '@/components/ui/button';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  {
    name: 'Accessories',
    items: ['Watches', 'Jewelry', 'Scarves', 'Sunglasses'],
    image: 'https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg'
  },
  {
    name: 'Clothing',
    items: ['Coats', 'Dresses', 'Shirts', 'Pants'],
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'
  },
  {
    name: 'Bags',
    items: ['Handbags', 'Clutches', 'Totes', 'Backpacks'],
    image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg'
  },
  {
    name: 'Home',
    items: ['Candles', 'Decor', 'Textiles', 'Art'],
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'
  }
];

const collections = [
  { name: 'New Arrivals', tag: 'New' },
  { name: 'Best Sellers', tag: 'Popular' },
  { name: 'Limited Edition', tag: 'Limited Edition' },
  { name: 'Sustainable', tag: 'Sustainable' }
];

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // CSS-based animations instead of GSAP

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 w-screen bg-white border-t border-gray-100 shadow-xl z-50 animate-fade-in-down"
      onMouseLeave={onClose}
    >
      <div ref={menuRef} className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
              Shop by Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div key={category.name} className="mega-menu-item group animate-fade-in-up">
                  <Link href={`/shop?category=${category.name}`} className="block">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-space-grotesk font-semibold mb-2 group-hover:text-luxury-gold transition-colors">
                      {category.name}
                    </h4>
                    <ul className="space-y-1">
                      {category.items.map(item => (
                        <li key={item}>
                          <Link
                            href={`/shop?category=${category.name}&subcategory=${item}`}
                            className="text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
              Collections
            </h3>
            <div className="space-y-4">
              {collections.map((collection, index) => (
                <div
                  key={collection.name}
                  className="mega-menu-item block group animate-fade-in-up"
                >
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-luxury-gold transition-colors">
                    <div>
                      <LinkHover
                        href={`/shop?tags=${collection.tag}`}
                        title={collection.name}
                        className="font-space-grotesk font-medium group-hover:text-luxury-gold transition-colors block"
                      />
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        {collection.tag}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-luxury-gold group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Product */}
            <div className="mega-menu-item mt-8 p-6 bg-luxury-sand rounded-lg animate-fade-in-up">
              <h4 className="font-space-grotesk font-semibold mb-2">Featured</h4>
              <p className="text-sm text-gray-600 mb-4">
                Discover our signature collection of handcrafted luxury pieces.
              </p>
              <Button asChild>
                <Link href="/shop?tags=Popular">
                  Shop Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}