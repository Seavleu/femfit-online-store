'use client';

import { useState } from 'react';
import { ChevronDown, Play, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllThumbnails, setShowAllThumbnails] = useState(false);

  const visibleThumbnails = showAllThumbnails ? images : images.slice(0, 7);

  return (
    <div className="flex space-x-4">
      {/* Thumbnail Gallery */}
      <div className="flex flex-col space-y-2 w-20">
        {visibleThumbnails.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative w-16 h-16 overflow-hidden border-2 transition-all",
              selectedImage === index 
                ? "border-black" 
                : "border-gray-200 hover:border-gray-400"
            )}
          >
            <img
              src={image}
              alt={`${productName} ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {index === 1 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
        
        {images.length > 7 && !showAllThumbnails && (
          <button
            onClick={() => setShowAllThumbnails(true)}
            className="w-16 h-8 border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      {/* Main Product Image */}
      <div className="flex-1 relative">
        {/* Similar Products Button */}
        <button className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium hover:bg-white transition-colors">
          <Camera className="w-4 h-4" />
          <span>SEE SIMILAR PRODUCTS</span>
        </button>

        {/* Main Image */}
        <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={images[selectedImage]}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
