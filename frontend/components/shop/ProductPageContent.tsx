'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api';
import ProductDetail from '@/components/shop/ProductDetail';

interface ProductPageContentProps {
  productId: string;
}

export default function ProductPageContent({ productId }: ProductPageContentProps) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const response = await apiClient.getProduct(productId);

      if (response.success && response.data) {
        // Convert backend product to frontend format
        const formattedProduct = {
          id: response.data._id,
          name: response.data.name,
          price: response.data.price,
          image: response.data.images?.[0]?.url || response.data.primaryImage?.url,
          description: response.data.description,
          category: response.data.category,
          tags: response.data.tags || [],
          sizes: response.data.sizes?.map((s: any) => s.name) || [],
          images: response.data.images?.map((img: any) => img.url) || [],
          colors: response.data.colors?.map((c: any) => c.name) || [],
          material: response.data.material || '',
          care: response.data.care || [],
          details: response.data.details || '',
          stock: response.data.totalStock || 0,
        };
        
        setProduct(formattedProduct);
      } else {
        notFound();
      }
    } catch (error) {
      console.error('Error loading product:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <ProductDetail product={product} />
  );
}

