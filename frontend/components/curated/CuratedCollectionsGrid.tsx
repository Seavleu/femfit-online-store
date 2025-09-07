'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

export default function CuratedCollectionsGrid() {
  const collections = [
    {
      id: 'all-season',
      title: 'ALL SEASON COLLECTION',
      subtitle: 'Year-Round Essentials',
      description: 'Our complete collection featuring the best pieces for every season in Cambodia.',
      gradient: 'from-purple-200 to-pink-300',
      icon: '🌟',
      productCount: 184,
      featured: true
    },
    {
      id: 'dry-season',
      title: 'DRY SEASON COLLECTION',
      subtitle: 'Light & Breathable Essentials',
      description: 'Perfect for Cambodia\'s dry season with lightweight, breathable fabrics and versatile pieces.',
      gradient: 'from-amber-200 to-orange-300',
      icon: '☀️',
      productCount: 24,
      featured: true
    },
    {
      id: 'wet-season',
      title: 'WET SEASON COLLECTION',
      subtitle: 'Water-Resistant & Quick-Dry',
      description: 'Stay comfortable during Cambodia\'s rainy season with water-resistant materials.',
      gradient: 'from-blue-200 to-blue-400',
      icon: '🌧️',
      productCount: 18,
      featured: true
    },
    {
      id: 'cool-season',
      title: 'COOL SEASON COLLECTION',
      subtitle: 'Layered & Cozy',
      description: 'Embrace Cambodia\'s cooler months with layered pieces and cozy essentials.',
      gradient: 'from-gray-200 to-gray-400',
      icon: '🍂',
      productCount: 22,
      featured: false
    },
    {
      id: 'hot-season',
      title: 'HOT SEASON COLLECTION',
      subtitle: 'Ultra-Light & Airy',
      description: 'Beat Cambodia\'s intense heat with ultra-lightweight, airy fabrics.',
      gradient: 'from-red-200 to-pink-300',
      icon: '🔥',
      productCount: 20,
      featured: false
    }
  ];

  const featuredCollections = collections.filter(c => c.featured);
  const otherCollections = collections.filter(c => !c.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wider">
            CURATED COLLECTIONS
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover our seasonal collections curated specifically for Cambodian women. 
            From dry season essentials to wet season protection.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>☀️ Dry Season</span>
            <span>🌧️ Wet Season</span>
            <span>🍂 Cool Season</span>
            <span>🔥 Hot Season</span>
          </div>
        </div>
      </div>

      {/* Featured Collections */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Collections
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {featuredCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/curated/${collection.id}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ImagePlaceholder
                  width={400}
                  height={400}
                  className="w-full h-96"
                  gradient={collection.gradient}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-8">
                    <div className="text-6xl mb-4">{collection.icon}</div>
                    <h3 className="text-3xl font-bold mb-2 tracking-wider">
                      {collection.title}
                    </h3>
                    <p className="text-lg mb-4 opacity-90">
                      {collection.subtitle}
                    </p>
                    <p className="text-sm opacity-80 mb-6 max-w-md">
                      {collection.description}
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      <span>{collection.productCount} products</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </ImagePlaceholder>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* All Collections Grid */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            All Collections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/curated/${collection.id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square relative">
                  <ImagePlaceholder
                    width={300}
                    height={300}
                    className="w-full h-full"
                    gradient={collection.gradient}
                  >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                      <div className="text-4xl mb-2">{collection.icon}</div>
                      <h3 className="text-lg font-bold mb-1">
                        {collection.title.split(' ')[0]}
                      </h3>
                      <p className="text-xs opacity-90">
                        {collection.subtitle}
                      </p>
                    </div>
                  </ImagePlaceholder>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
                    {collection.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {collection.productCount} products
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Why Curated Collections */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Curated Collections?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our collections are carefully curated to match Cambodia's unique climate and cultural preferences, 
              ensuring you always have the perfect pieces for every season.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌡️</div>
              <h3 className="text-xl font-semibold mb-2">Climate-Appropriate</h3>
              <p className="text-gray-600">
                Designed specifically for Cambodia's tropical climate with appropriate fabrics and styles.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">👗</div>
              <h3 className="text-xl font-semibold mb-2">Cultural Sensitivity</h3>
              <p className="text-gray-600">
                Respectful of local customs while embracing modern fashion trends.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                Each piece is carefully selected for quality, comfort, and durability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
