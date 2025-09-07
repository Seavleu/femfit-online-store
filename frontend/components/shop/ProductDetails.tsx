'use client';

import { useState } from 'react';
import { Heart, MapPin, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    price: string;
    colors: string[];
    sizes: string[];
    selectedColor: string;
    selectedSize: string;
    onColorChange: (color: string) => void;
    onSizeChange: (size: string) => void;
    onAddToCart: () => void;
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const sections = [
    {
      id: 'editors-note',
      title: "Editor's Note",
      content: "This elegant Mary Jane features a sophisticated crossover strap design with studded details that add a modern edge to the classic silhouette. Perfect for both professional and casual occasions."
    },
    {
      id: 'product-details',
      title: 'Product Details',
      content: "• Faux suede upper\n• Studded crossover straps\n• Bow detail at front\n• Flat sole\n• Pointed toe\n• Available in multiple colors\n• Imported"
    },
    {
      id: 'promotion',
      title: 'Promotion',
      content: "Get 10% off*, subscribe to our newsletter, and become a member*!"
    },
    {
      id: 'shipping-returns',
      title: 'Shipping and Returns',
      content: "• Free shipping on orders over $100\n• 30-day return policy\n• Express shipping available\n• International shipping to select countries"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Product Title & Price */}
      <div>
        <div className="mb-2">
          <span className="bg-black text-white text-xs px-2 py-1 font-medium">
            New products
          </span>
        </div>
        <h1 className="text-2xl font-medium mb-2">{product.name}</h1>
        <p className="text-2xl font-bold">{product.price}</p>
      </div>

      {/* Color Selection */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm font-medium">Color:</span>
          <span className="text-sm text-gray-600 capitalize">{product.selectedColor}</span>
        </div>
        <div className="flex space-x-3">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => product.onColorChange(color)}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                product.selectedColor === color
                  ? "border-black scale-110"
                  : "border-gray-300 hover:border-gray-400"
              )}
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">size:</span>
            <span className="text-sm text-gray-600">
              {product.selectedSize || 'Select size'}
            </span>
          </div>
          <button className="text-sm text-gray-600 underline hover:text-black transition-colors">
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => product.onSizeChange(size)}
              className={cn(
                "py-2 px-3 border text-sm font-medium transition-all",
                product.selectedSize === size
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:border-gray-400"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={product.onAddToCart}
        className="w-full bg-black text-white py-4 px-6 font-medium hover:bg-gray-800 transition-colors"
      >
        ADD TO SHOPPING BAG
      </button>

      {/* Additional Options */}
      <div className="flex space-x-6">
        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black transition-colors">
          <Heart className="w-4 h-4" />
          <span>Add to Wishlist</span>
        </button>
        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black transition-colors">
          <MapPin className="w-4 h-4" />
          <span>Check store inventory</span>
        </button>
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-2">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-gray-200">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="font-medium">{section.title}</span>
              <ChevronRight 
                className={cn(
                  "w-4 h-4 transition-transform",
                  expandedSections.includes(section.id) && "rotate-90"
                )}
              />
            </button>
            {expandedSections.includes(section.id) && (
              <div className="pb-4 text-sm text-gray-600 whitespace-pre-line">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
