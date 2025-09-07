'use client';

import { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/data/products';
import { formatPrice } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface RecentlyViewedProductsProps {
  maxProducts?: number;
  className?: string;
}

export default function RecentlyViewedProducts({ maxProducts = 4, className }: RecentlyViewedProductsProps) {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = () => {
    try {
      const saved = localStorage.getItem('recentlyViewed');
      if (saved) {
        const products = JSON.parse(saved);
        setRecentProducts(products.slice(0, maxProducts));
      }
    } catch (error) {
      console.error('Error loading recently viewed products:', error);
    }
  };

  const clearRecentlyViewed = () => {
    localStorage.removeItem('recentlyViewed');
    setRecentProducts([]);
  };

  const removeProduct = (productId: string) => {
    const updated = recentProducts.filter(p => p.id.toString() !== productId);
    setRecentProducts(updated);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  if (recentProducts.length === 0) {
    return null;
  }

  const displayedProducts = isExpanded ? recentProducts : recentProducts.slice(0, 2);

  return (
    <div className={cn("bg-white border border-gray-100 rounded-2xl p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-luxury-gold" />
          <h3 className="text-lg font-space-grotesk font-semibold">Recently Viewed</h3>
        </div>
        <div className="flex items-center space-x-2">
          {recentProducts.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              {isExpanded ? 'Show Less' : `Show ${recentProducts.length - 2} More`}
            </button>
          )}
          <button
            onClick={clearRecentlyViewed}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            title="Clear recently viewed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayedProducts.map((product) => (
          <div key={product.id} className="group relative">
            <button
              onClick={() => removeProduct(product.id.toString())}
              className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
              title="Remove from recently viewed"
            >
              <X className="w-3 h-3" />
            </button>
            
            <Link
              href={`/shop/${product.id}`}
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-luxury-gold transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">{product.category}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(product.price, 'USD')}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {recentProducts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href="/shop"
            className="text-sm text-luxury-gold hover:text-luxury-gold/80 transition-colors font-medium"
          >
            Continue Shopping →
          </Link>
        </div>
      )}
    </div>
  );
}

// Utility function to add product to recently viewed
export const addToRecentlyViewed = (product: Product) => {
  try {
    const saved = localStorage.getItem('recentlyViewed');
    let recent: Product[] = saved ? JSON.parse(saved) : [];
    
    // Remove if already exists
    recent = recent.filter(p => p.id !== product.id);
    
    // Add to beginning
    recent.unshift(product);
    
    // Keep only last 10 products
    recent = recent.slice(0, 10);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recent));
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
};
