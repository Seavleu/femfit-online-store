'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/data/products';
import { formatPrice } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface ProductRecommendationsProps {
  currentProduct?: Product;
  category?: string;
  tags?: string[];
  maxProducts?: number;
  className?: string;
}

export default function ProductRecommendations({ 
  currentProduct, 
  category, 
  tags = [], 
  maxProducts = 6,
  className 
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [currentProduct, category, tags]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // For now, we'll simulate recommendations based on category and tags
      const allProducts = await import('@/data/products').then(m => m.products);
      
      let filtered = allProducts.filter(product => 
        product.id !== currentProduct?.id
      );

      // Filter by category if available
      if (category) {
        filtered = filtered.filter(product => 
          product.category === category
        );
      }

      // Filter by tags if available
      if (tags.length > 0) {
        filtered = filtered.filter(product => 
          tags.some(tag => product.tags.includes(tag))
        );
      }

      // If not enough products, add some from the same category
      if (filtered.length < maxProducts && category) {
        const categoryProducts = allProducts.filter(product => 
          product.category === category && product.id !== currentProduct?.id
        );
        filtered = [...filtered, ...categoryProducts];
      }

      // If still not enough, add popular products
      if (filtered.length < maxProducts) {
        const popularProducts = allProducts.filter(product => 
          product.tags.includes('Popular') && product.id !== currentProduct?.id
        );
        filtered = [...filtered, ...popularProducts];
      }

      // Remove duplicates and limit
      const uniqueProducts = filtered.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      );

      setRecommendations(uniqueProducts.slice(0, maxProducts));
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn("bg-white border border-gray-100 rounded-2xl p-6", className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={cn("bg-white border border-gray-100 rounded-2xl p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-luxury-gold" />
          <h3 className="text-lg font-space-grotesk font-semibold">
            {currentProduct ? 'You Might Also Like' : 'Recommended for You'}
          </h3>
        </div>
        <Link
          href="/shop"
          className="text-sm text-luxury-gold hover:text-luxury-gold/80 transition-colors font-medium flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((product) => (
          <div key={product.id} className="group">
            <Link
              href={`/shop/${product.id}`}
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="space-y-3">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Status Badges */}
                  {product.tags.includes('New') && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      New
                    </span>
                  )}
                  {product.tags.includes('Sale') && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                      Sale
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-luxury-gold transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(product.price, 'USD')}
                    </p>
                    {product.tags.includes('Popular') && (
                      <TrendingUp className="w-4 h-4 text-luxury-gold" />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {recommendations.length >= maxProducts && (
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-luxury-gold hover:text-luxury-gold/80 transition-colors font-medium"
          >
            <span>Discover More Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

// Utility function to get recommendations for a product
export const getProductRecommendations = async (
  currentProduct: Product, 
  maxProducts: number = 6
): Promise<Product[]> => {
  try {
    const allProducts = await import('@/data/products').then(m => m.products);
    
    // Get products from the same category
    const categoryProducts = allProducts.filter(product => 
      product.category === currentProduct.category && product.id !== currentProduct.id
    );
    
    // Get products with similar tags
    const tagProducts = allProducts.filter(product => 
      product.id !== currentProduct.id && 
      currentProduct.tags.some(tag => product.tags.includes(tag))
    );
    
    // Get popular products
    const popularProducts = allProducts.filter(product => 
      product.tags.includes('Popular') && product.id !== currentProduct.id
    );
    
    // Combine and prioritize
    const recommendations = [
      ...categoryProducts,
      ...tagProducts,
      ...popularProducts
    ];
    
    // Remove duplicates and limit
    const uniqueProducts = recommendations.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );
    
    return uniqueProducts.slice(0, maxProducts);
  } catch (error) {
    console.error('Error getting product recommendations:', error);
    return [];
  }
};
