'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubCategory {
  id: string;
  name: string;
  href: string;
}

interface Category {
  id: string;
  name: string;
  href?: string;
  subCategories?: SubCategory[];
}

interface AnimatedSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnimatedSidebar({ isOpen, onClose }: AnimatedSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const categories: Category[] = [
    {
      id: 'trending',
      name: 'Trending Now',
      href: '/shop?filter=trending'
    },
    {
      id: 'shoes',
      name: 'Shoes',
      subCategories: [
        { id: 'sandals', name: 'Sandals', href: '/shop/shoes/sandals' },
        { id: 'flats', name: 'Flats', href: '/shop/shoes/flats' },
        { id: 'heels', name: 'Heels', href: '/shop/shoes/heels' },
        { id: 'boots', name: 'Boots', href: '/shop/shoes/boots' },
        { id: 'sneakers', name: 'Sneakers', href: '/shop/shoes/sneakers' }
      ]
    },
    {
      id: 'bags',
      name: 'Bags',
      subCategories: [
        { id: 'handbags', name: 'Handbags', href: '/shop/bags/handbags' },
        { id: 'totes', name: 'Totes', href: '/shop/bags/totes' },
        { id: 'clutches', name: 'Clutches', href: '/shop/bags/clutches' },
        { id: 'backpacks', name: 'Backpacks', href: '/shop/bags/backpacks' }
      ]
    },
    {
      id: 'accessories',
      name: 'Accessories',
      subCategories: [
        { id: 'jewelry', name: 'Jewelry', href: '/shop/accessories/jewelry' },
        { id: 'scarves', name: 'Scarves', href: '/shop/accessories/scarves' },
        { id: 'belts', name: 'Belts', href: '/shop/accessories/belts' },
        { id: 'sunglasses', name: 'Sunglasses', href: '/shop/accessories/sunglasses' }
      ]
    },
    {
      id: 'cosmetics',
      name: 'Cosmetics',
      subCategories: [
        { id: 'makeup', name: 'Makeup', href: '/shop/cosmetics/makeup' },
        { id: 'skincare', name: 'Skincare', href: '/shop/cosmetics/skincare' },
        { id: 'fragrance', name: 'Fragrance', href: '/shop/cosmetics/fragrance' }
      ]
    },
    {
      id: 'perfume',
      name: 'Perfume',
      subCategories: [
        { id: 'women', name: "Women's", href: '/shop/perfume/women' },
        { id: 'men', name: "Men's", href: '/shop/perfume/men' },
        { id: 'unisex', name: 'Unisex', href: '/shop/perfume/unisex' }
      ]
    },
    {
      id: 'gift',
      name: 'Gift',
      href: '/shop/gift'
    },
    {
      id: 'sale',
      name: 'Sale',
      href: '/shop/sale'
    },
    {
      id: 'story',
      name: 'Story',
      href: '/about'
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.sidebar-container')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 bg-white z-50 sidebar-container transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold">New Products</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-6">
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  {category.subCategories ? (
                    <div>
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex items-center justify-between py-3 px-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                      >
                        <span className="font-medium group-hover:text-black">
                          {category.name}
                        </span>
                        <ChevronRight 
                          className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            expandedCategories.includes(category.id) && "rotate-90"
                          )}
                        />
                      </button>
                      
                      {/* Sub Categories */}
                      <div className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        expandedCategories.includes(category.id) 
                          ? "max-h-96 opacity-100" 
                          : "max-h-0 opacity-0"
                      )}>
                        <ul className="ml-4 space-y-1">
                          {category.subCategories.map((subCategory) => (
                            <li key={subCategory.id}>
                              <a
                                href={subCategory.href}
                                className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={onClose}
                              >
                                {subCategory.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <a
                      href={category.href}
                      className="block py-3 px-2 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      {category.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Additional Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <ul className="space-y-2">
                <li>
                  <a
                    href="/orders"
                    className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    Order Inquiry
                  </a>
                </li>
                <li>
                  <a
                    href="/stores"
                    className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    Store Location
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  Cambodia, KH ₩
                </div>
                <div className="text-sm text-gray-600">
                  Khmer
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
