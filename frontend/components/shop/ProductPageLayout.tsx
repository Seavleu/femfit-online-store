'use client';

import { useState } from 'react';
import ProductImageGallery from './ProductImageGallery';
import ProductDetails from './ProductDetails';
import SimilarProducts from './SimilarProducts';
import { LAYOUT_CONSTANTS, RESPONSIVE } from '@/lib/layout';

interface Product {
  id: string;
  name: string;
  price: string;
  images: string[];
  colors: string[];
  sizes: string[];
}

interface ProductPageLayoutProps {
  product: Product;
  similarProducts: Product[];
}

export default function ProductPageLayout({ product, similarProducts }: ProductPageLayoutProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'black');
  const [selectedSize, setSelectedSize] = useState('');

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    // Add to cart logic here
    console.log('Added to cart:', { product, selectedColor, selectedSize });
  };

  return (
    <div className={`${LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH} mx-auto ${LAYOUT_CONSTANTS.CONTAINER_PADDING} pt-24 pb-16`}>
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>home</span>
          <span>/</span>
          <span>shoes</span>
          <span>/</span>
          <span>flat | ballerina</span>
          <span>/</span>
          <span className="text-black font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className={`${RESPONSIVE.GRID_2} ${LAYOUT_CONSTANTS.GAP_LARGE} mb-16`}>
        {/* Product Images */}
        <div>
          <ProductImageGallery 
            images={product.images} 
            productName={product.name}
          />
        </div>

        {/* Product Details */}
        <div>
          <ProductDetails
            product={{
              ...product,
              selectedColor,
              selectedSize,
              onColorChange: setSelectedColor,
              onSizeChange: setSelectedSize,
              onAddToCart: handleAddToCart
            }}
          />
        </div>
      </div>

      {/* Similar Products */}
      <SimilarProducts products={similarProducts} />
    </div>
  );
}
