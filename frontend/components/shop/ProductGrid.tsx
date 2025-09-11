'use client';

import { useState } from 'react';
import { Sliders, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LAYOUT_CONSTANTS, RESPONSIVE } from '@/lib/layout';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  colors?: string[];
  isNew?: boolean;
}

interface ProductGridProps {
  products: Product[];
  totalCount: number;
  currentPage: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function ProductGrid({ 
  products, 
  totalCount, 
  currentPage, 
  sortBy, 
  onSortChange 
}: ProductGridProps) {
  const [selectedLook, setSelectedLook] = useState('');

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
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
              className="text-sm border-none bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">look</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="sporty">Sporty</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-600">
            {currentPage} of {Math.ceil(totalCount / 24)} items — Showing {Math.min(24, totalCount)} items
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-sm border-none bg-transparent focus:outline-none cursor-pointer font-medium"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2">
            <button className="w-6 h-6 border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors" />
            <button className="w-6 h-6 border border-gray-300 hover:bg-gray-50 transition-colors" />
            <button className="w-6 h-6 border border-gray-300 hover:bg-gray-50 transition-colors" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className={`${RESPONSIVE.GRID_4} ${LAYOUT_CONSTANTS.GAP_SMALL}`}>
        {products.map((product) => (
          <ProductGridItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

interface ProductGridItemProps {
  product: Product;
}

function ProductGridItem({ product }: ProductGridItemProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Add to Cart Button */}
        <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50">
          <Plus className="w-4 h-4 text-gray-700" />
        </button>
        
        {product.isNew && (
          <div className="absolute top-3 left-3">
            <span className="bg-black text-white text-xs px-2 py-1 font-medium">
              New product
            </span>
          </div>
        )}
      </div>

      {/* Color Options */}
      {product.colors && product.colors.length > 0 && (
        <div className="flex space-x-2 mb-3">
          {product.colors.map((color, index) => (
            <button
              key={index}
              onMouseEnter={() => setHoveredColor(color)}
              onMouseLeave={() => setHoveredColor(null)}
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                hoveredColor === color 
                  ? "border-black scale-110" 
                  : "border-gray-300 hover:border-gray-400"
              )}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div>
      )}

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600">{product.price}</p>
      </div>
    </div>
  );
}
