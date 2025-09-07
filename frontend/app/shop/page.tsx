'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Sliders, Grid, List } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import CategoryNavigation from '@/components/shop/CategoryNavigation';
import ProductGrid from '@/components/shop/ProductGrid';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  colors?: string[];
  isNew?: boolean;
  category: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Category data matching the image layout
  const categories = [
    {
      id: 'activewear',
      name: 'activewear',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300&h=300&fit=crop'
    },
    {
      id: 'bags',
      name: 'bags',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
    },
    {
      id: 'shoes',
      name: 'shoes',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop'
    },
    {
      id: 'accessories',
      name: 'accessories',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop'
    },
    {
      id: 'cosmetics',
      name: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop'
    },
    {
      id: 'perfume',
      name: 'perfume',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop'
    }
  ];

  // Mock product data in Charles & Keith style
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Goel Faux Suede Studded Crossover-Strap Bow Mary Jane - Brown',
      price: '₩95,900',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop',
      colors: ['#8B4513', '#000000'],
      isNew: true,
      category: 'shoes'
    },
    {
      id: '2',
      name: 'Goel Studded Crossover-Strap Bow Mary Jane - Black',
      price: '₩95,900',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
      colors: ['#000000', '#8B4513'],
      isNew: true,
      category: 'shoes'
    },
    {
      id: '3',
      name: 'Linden Side-Zip Buckle-Strap Ankle Boots - Dark Brown',
      price: '₩139,900',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=500&fit=crop',
      colors: ['#654321', '#000000'],
      isNew: true,
      category: 'shoes'
    },
    {
      id: '4',
      name: 'Linden Side-Zip Buckle-Strap Ankle Boots - Black',
      price: '₩139,900',
      image: 'https://images.unsplash.com/photo-1608256246200-53e8b6d1a46f?w=400&h=500&fit=crop',
      colors: ['#000000', '#654321'],
      isNew: true,
      category: 'shoes'
    },
    {
      id: '5',
      name: 'Minimal Leather Tote Bag - Camel',
      price: '₩189,900',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
      colors: ['#C19A6B', '#000000', '#8B4513'],
      category: 'bags'
    },
    {
      id: '6',
      name: 'Chain Shoulder Bag - Black',
      price: '₩159,900',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop',
      colors: ['#000000', '#8B4513'],
      category: 'bags'
    },
    {
      id: '7',
      name: 'Silk Lotus Scarf - Pink',
      price: '₩79,900',
      image: 'https://images.unsplash.com/photo-1591451658019-89e396a1a1ac?w=400&h=500&fit=crop',
      colors: ['#FFC0CB', '#000080', '#FF1493'],
      category: 'accessories'
    },
    {
      id: '8',
      name: 'Gold Chain Necklace',
      price: '₩129,900',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop',
      colors: ['#FFD700', '#C0C0C0'],
      category: 'accessories'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = products.filter(product => 
    !selectedCategory || product.category === selectedCategory
  );

  if (loading) {
    return (
      <main className="bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white text-black min-h-screen">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>home</span>
          <span>/</span>
          <span className="text-black font-medium">
            {selectedCategory || 'shoes'}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 uppercase">
            {selectedCategory?.toUpperCase() || 'SHOES'}
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A beautiful pair of shoes can instantly elevate your look. From mismatched designs to sleek blade heels, feminine 
            ankle straps, and sensuous eyelet embellishments, these subtle yet stylish details will help you win the style game.
          </p>
        </div>

        {/* Category Navigation */}
        <CategoryNavigation
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          totalCount={filteredProducts.length}
          currentPage={currentPage}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      <Footer />
    </main>
  );
}