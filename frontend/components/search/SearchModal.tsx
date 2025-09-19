'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const recentSearches = ['luxury handbags', 'watches', 'silk scarves', 'jewelry'];
const trendingSearches = ['limited edition', 'new arrivals', 'sustainable', 'bestsellers'];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(products.slice(0, 6));
  const [isSearching, setIsSearching] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true);
      
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        setResults(filtered.slice(0, 8));
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults(products.slice(0, 6));
      setIsSearching(false);
    }
  }, [query]);

  const handleClose = () => {
    onClose();
  };

  const handleSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 animate-fade-in">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center p-6 border-b border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-lg border-none outline-none bg-gray-50 rounded-lg"
            />
          </div>
          <button
            onClick={handleClose}
            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {!query.trim() ? (
            <div className="space-y-6">
              {/* Recent Searches */}
              <div>
                <h3 className="flex items-center space-x-2 text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Recent Searches</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(search => (
                    <button
                      key={search}
                      onClick={() => handleSearchClick(search)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Searches */}
              <div>
                <h3 className="flex items-center space-x-2 text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map(search => (
                    <button
                      key={search}
                      onClick={() => handleSearchClick(search)}
                      className="px-3 py-2 bg-luxury-gold/10 hover:bg-luxury-gold/20 text-luxury-gold rounded-full text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Products */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Popular Products
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.slice(0, 4).map(product => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.id}`}
                      onClick={handleClose}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <div className="text-sm text-gray-500">
                          <span className="font-semibold">${product.price.usd.toLocaleString()}</span>
                          <span className="ml-2 text-xs text-gray-400">៛{product.price.khr.toLocaleString()}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Search Results ({results.length})
                  </h3>
                  {results.length > 0 ? (
                    <div className="space-y-3">
                      {results.map(product => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.id}`}
                          onClick={handleClose}
                          className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium mb-1">{product.name}</h4>
                            <p className="text-sm text-gray-600 mb-1 truncate">{product.description}</p>
                            <div className="flex items-center space-x-2">
                              <span className="font-space-grotesk font-bold">
                                ${product.price.usd.toLocaleString()}
                              </span>
                              <span className="ml-2 text-xs text-gray-400">
                                ៛{product.price.khr.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500">{product.category}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                      
                      {results.length > 8 && (
                        <Link
                          href={`/shop?search=${encodeURIComponent(query)}`}
                          onClick={handleClose}
                          className="block text-center py-3 text-luxury-gold hover:text-black transition-colors font-medium"
                        >
                          View all {results.length} results
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No products found for "{query}"</p>
                      <p className="text-sm text-gray-400">Try searching for something else</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}