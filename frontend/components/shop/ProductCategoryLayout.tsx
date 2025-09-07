'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Filter, Grid, List, ChevronLeft, Star, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  colors: string[];
  sizes: string[];
  rating: number;
  reviews: number;
}

interface CategoryData {
  name: string;
  displayName: string;
  description: string;
  products: Product[];
}

interface ProductCategoryLayoutProps {
  gender: 'women' | 'men';
  category: string;
  categoryData: CategoryData;
}

export default function ProductCategoryLayout({ 
  gender, 
  category, 
  categoryData 
}: ProductCategoryLayoutProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const categoryIcons = {
    'bags': '👜',
    'boots': '👢',
    'shoes': '👟',
    'loafers': '👞',
    'sandals': '🩴',
    'heels': '👠',
    'flats': '🥿',
    'handbags': '👜',
    'totes': '🛍️',
    'clutches': '👛',
    'backpacks': '🎒',
    'shoulder-bags': '👜',
    'accessories': '💍',
    'jewelry': '💎',
    'scarves': '🧣',
    'belts': '🪢',
    'sunglasses': '🕶️',
    'cosmetics': '💄',
    'makeup': '💋',
    'skincare': '🧴',
    'fragrance': '🌸',
    'perfume': '🌺',
    'clothing': '👗',
    'dresses': '👗',
    'tops': '👕',
    'bottoms': '👖',
    'outerwear': '🧥',
    'new': '✨',
    'sale': '🏷️',
    'trending': '🔥'
  };

  const categoryGradients = {
    'bags': 'from-amber-200 to-orange-300',
    'boots': 'from-gray-300 to-gray-500',
    'shoes': 'from-blue-200 to-blue-400',
    'loafers': 'from-orange-200 to-orange-400',
    'sandals': 'from-yellow-200 to-yellow-400',
    'heels': 'from-pink-200 to-pink-400',
    'flats': 'from-green-200 to-green-400',
    'handbags': 'from-purple-200 to-purple-400',
    'totes': 'from-indigo-200 to-indigo-400',
    'clutches': 'from-rose-200 to-rose-400',
    'backpacks': 'from-teal-200 to-teal-400',
    'shoulder-bags': 'from-amber-200 to-amber-400',
    'accessories': 'from-violet-200 to-violet-400',
    'jewelry': 'from-yellow-200 to-yellow-400',
    'scarves': 'from-red-200 to-red-400',
    'belts': 'from-brown-200 to-brown-400',
    'sunglasses': 'from-gray-200 to-gray-400',
    'cosmetics': 'from-pink-200 to-pink-400',
    'makeup': 'from-rose-200 to-rose-400',
    'skincare': 'from-blue-200 to-blue-400',
    'fragrance': 'from-purple-200 to-purple-400',
    'perfume': 'from-lavender-200 to-lavender-400',
    'clothing': 'from-green-200 to-green-400',
    'dresses': 'from-pink-200 to-pink-400',
    'tops': 'from-blue-200 to-blue-400',
    'bottoms': 'from-gray-200 to-gray-400',
    'outerwear': 'from-slate-200 to-slate-400',
    'new': 'from-green-200 to-green-400',
    'sale': 'from-red-200 to-red-400',
    'trending': 'from-orange-200 to-orange-400'
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/shop" className="text-gray-500 hover:text-gray-700">
              Shop
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/shop/${gender}`} className="text-gray-500 hover:text-gray-700">
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {categoryData.displayName}
            </span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-4 mb-8">
            <div className="text-6xl">
              {categoryIcons[category as keyof typeof categoryIcons] || '🛍️'}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {gender.charAt(0).toUpperCase() + gender.slice(1)}'s {categoryData.displayName}
              </h1>
              <p className="text-lg text-gray-600">
                {categoryData.description}
              </p>
            </div>
          </div>

          {/* Filter and Sort Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <div className="text-sm text-gray-600">
                {categoryData.products.length} items
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'grid' ? "bg-pink-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'list' ? "bg-pink-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={cn(
            "grid gap-1",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          )}>
            {categoryData.products.map((product) => (
              <div
                key={product.id}
                className={cn(
                  "group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300",
                  viewMode === 'list' && "flex"
                )}
              >
                <div className={cn(
                  "relative overflow-hidden",
                  viewMode === 'grid' ? "aspect-square" : "w-48 h-48 flex-shrink-0"
                )}>
                  <ImagePlaceholder
                    width="100%"
                    height="100%"
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    gradient={categoryGradients[category as keyof typeof categoryGradients] || 'from-gray-200 to-gray-300'}
                  >
                    <div className="text-4xl">
                      {categoryIcons[category as keyof typeof categoryIcons] || '🛍️'}
                    </div>
                  </ImagePlaceholder>
                  
                  {/* Add to Cart Button */}
                  <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50">
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                  
                  {/* Color Options */}
                  <div className="absolute bottom-2 left-2 flex space-x-1">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ 
                          backgroundColor: color === 'black' ? '#000000' : 
                                         color === 'white' ? '#ffffff' : 
                                         color === 'brown' ? '#8B4513' :
                                         color === 'tan' ? '#D2B48C' :
                                         color === 'nude' ? '#F5DEB3' :
                                         color === 'red' ? '#FF0000' :
                                         color === 'navy' ? '#000080' :
                                         color === 'burgundy' ? '#800020' : '#8B4513'
                        }}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm bg-gray-400 flex items-center justify-center">
                        <span className="text-xs text-white">+</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={cn(
                  "p-4",
                  viewMode === 'list' && "flex-1"
                )}>
                  <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(product.rating) 
                              ? "text-yellow-400 fill-current" 
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  <p className="text-lg font-bold text-gray-900">
                    ${product.price.toLocaleString()}
                  </p>
                  
                  {viewMode === 'list' && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Available in {product.colors.length} colors</p>
                      <p>Sizes: {product.sizes.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Back to Shop */}
          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Shop</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
