'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Filter, Grid, List, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import CategoryNavigation from '@/components/shop/CategoryNavigation';
import ProductGrid from '@/components/shop/ProductGrid';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  colors: string[];
}

interface Collection {
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  products: Product[];
}

interface CuratedCollectionLayoutProps {
  season: string;
  collection: Collection;
}

export default function CuratedCollectionLayout({ season, collection }: CuratedCollectionLayoutProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const seasonNames = {
    'dry-season': 'Dry Season',
    'wet-season': 'Wet Season',
    'cool-season': 'Cool Season',
    'hot-season': 'Hot Season'
  };

  // Category data for the season
  const categories = [
    {
      id: 'jackets',
      name: 'jackets',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop'
    },
    {
      id: 'pants',
      name: 'pants',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop'
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
      id: 'rainwear',
      name: 'rainwear',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop'
    }
  ];

  // Convert collection products to match ProductGrid format
  const products = collection.products.map(product => ({
    id: product.id.toString(),
    name: product.name,
    price: `₩${product.price.toLocaleString()}`,
    image: product.image,
    colors: product.colors,
    category: 'wet-season'
  }));

  const filteredProducts = products.filter(product => 
    !selectedCategory || product.category === selectedCategory
  );

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">home</Link>
          <span>/</span>
          <Link href="/curated" className="hover:text-gray-700">curated</Link>
          <span>/</span>
          <span className="text-black font-medium">
            {seasonNames[season as keyof typeof seasonNames]}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 uppercase">
            {collection.title}
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {collection.description}
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
    </div>
  );
}
