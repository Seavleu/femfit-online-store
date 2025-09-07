'use client';

import { useState } from 'react';
import { Search, Heart, ShoppingBag, User, Sliders, ChevronDown } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import EnhancedProductCard from '@/components/shop/EnhancedProductCard';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
}

export default function AllSeasonCollectionPage() {
  const [selectedLook, setSelectedLook] = useState('look');
  const [sortBy, setSortBy] = useState('3');

  // Mock products matching the Charles & Keith layout
  const products: Product[] = [
    {
      id: '1',
      name: 'Victoria Recycled Suede Belted Trapeze Tote Bag - Sahara Sand',
      price: '₩165,900',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
      colors: ['#D2B48C', '#8B4513'], // Sahara Sand, Dark Brown
      sizes: ['One Size'],
      isNew: true
    },
    {
      id: '2',
      name: 'Pointed-toe back-zip stiletto-heel ankle boots - Dark Brown',
      price: '₩129,900',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=500&fit=crop',
      colors: ['#8B4513', '#000000'], // Dark Brown, Black
      sizes: ['35', '36', '37', '38', '39', '40', '41']
    },
    {
      id: '3',
      name: 'Pointed-toe back-zip stiletto-heel ankle boots - Black',
      price: '₩129,900',
      image: 'https://images.unsplash.com/photo-1608256246200-53e8b6d1a46f?w=400&h=500&fit=crop',
      colors: ['#8B4513', '#000000'], // Dark Brown, Black
      sizes: ['35', '36', '37', '38', '39', '40', '41']
    },
    {
      id: '4',
      name: 'Blaze Belt Shoulder Bag - Wineberry Red',
      price: '₩115,900',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
      colors: ['#800020', '#000000'], // Wineberry Red, Black
      sizes: ['One Size']
    },
    {
      id: '5',
      name: 'Blaze Belt Shoulder Bag - Noir',
      price: '₩115,900',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
      colors: ['#800020', '#000000'], // Wineberry Red, Black
      sizes: ['One Size']
    },
    {
      id: '6',
      name: 'Brina Buckle-Strap Crossbody Bag - Wineberry Red',
      price: '₩109,900',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
      colors: ['#800020', '#000000'], // Wineberry Red, Black
      sizes: ['One Size']
    },
    {
      id: '7',
      name: 'Brina Buckle-Strap Crossbody Bag - Noir',
      price: '₩109,900',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
      colors: ['#800020', '#000000'], // Wineberry Red, Black
      sizes: ['One Size']
    },
    {
      id: '8',
      name: 'Naira Double Chain Bracelet - Rose Gold',
      price: '₩45,900',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop',
      colors: ['#E8B4B8', '#C0C0C0'], // Rose Gold, Silver
      sizes: ['One Size']
    }
  ];

  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product);
    // TODO: Implement cart functionality
  };

  const handleAddToWishlist = (product: Product) => {
    console.log('Added to wishlist:', product);
    // TODO: Implement wishlist functionality
  };

  return (
    <main className="bg-white text-black min-h-screen">
      <Navigation />
      
      {/* Top Bar */}
      <div className="bg-gray-50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <Search className="w-4 h-4" />
              <span className="font-medium">GO SHOPPING</span>
              <span className="font-medium">NEW PRODUCTS</span>
            </div>
            <div className="text-center">
              <span className="text-gray-600">Today's first-ever payment instant discount event.</span>
            </div>
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <Heart className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <ShoppingBag className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <User className="w-5 h-5 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Name */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-wider">FEM & FIT</h1>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Banner */}
          <div className="relative h-96 bg-gradient-to-br from-amber-200 to-orange-300 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">ALL SEASON COLLECTION</h2>
              <div className="flex space-x-4">
                <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                  SHOP ALL
                </button>
                <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                  SHOES AND BAGS
                </button>
              </div>
            </div>
          </div>

          {/* Middle Banner */}
          <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl">👜</div>
            </div>
          </div>

          {/* Right Banner */}
          <div className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl">👠</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black transition-colors">
              <Sliders className="w-4 h-4" />
              <span>FILTER</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Classification:</span>
              <select
                value={selectedLook}
                onChange={(e) => setSelectedLook(e.target.value)}
                className="text-sm border-none bg-transparent focus:outline-none cursor-pointer appearance-none"
              >
                <option value="look">look</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="sporty">Sporty</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            1 of 184 items — Showing 24 items
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">SORT BY:</span>
            <div className="flex space-x-2">
              {['3', '4', '6'].map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={cn(
                    "w-6 h-6 text-sm font-medium transition-colors",
                    sortBy === option
                      ? "text-black font-bold"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <EnhancedProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
