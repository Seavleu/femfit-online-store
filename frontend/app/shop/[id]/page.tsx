import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ProductPageLayout from '@/components/shop/ProductPageLayout';

// Generate metadata for SEO (Server Component)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await apiClient.getProduct(id);
    
    if (!response.success || !response.data) {
      return {
        title: 'Product Not Found - FEMFIT',
        description: 'The requested product could not be found.',
      };
    }

    const product = response.data;

    return {
      title: `${product.name} - FEMFIT`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [product.images?.[0]?.url || product.primaryImage?.url],
      },
    };
  } catch (error) {
    return {
      title: 'Product Not Found - FEMFIT',
      description: 'The requested product could not be found.',
    };
  }
}

// Server Component (no "use client" directive)
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Mock product data matching the Charles & Keith layout
  const mockProduct = {
    id: id,
    name: 'Gael Studded Crossover-Strap Bow Mary Jane - Black',
    price: '₩95,900',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1608256246200-53e8b6d1a46f?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1608256246200-53e8b6d1a46f?w=400&h=500&fit=crop'
    ],
    colors: ['brown', 'black'],
    sizes: ['35', '36', '37', '38', '39', '40', '41']
  };

  const similarProducts = [
    {
      id: '2',
      name: 'Devan Side-Zip Rigid-Sole Calf Boots - Black',
      price: '₩135,900',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=500&fit=crop'
    },
    {
      id: '3',
      name: 'Gael Studded Convertible Kitten-Heel Knee-High Boots - Black',
      price: '₩165,900',
      image: 'https://images.unsplash.com/photo-1608256246200-53e8b6d1a46f?w=400&h=500&fit=crop'
    },
    {
      id: '4',
      name: 'Braided-Strap Back-Zip Knee-High Boots - Black',
      price: '₩159,900',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop'
    },
    {
      id: '5',
      name: 'Contrast-Trim Buckle-Strap Mary Jane - Black',
      price: '₩85,900',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop'
    },
    {
      id: '6',
      name: 'Linden Side-Zip Buckle-Strap Ankle Boots - Black',
      price: '₩139,900',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=500&fit=crop'
    }
  ];

  return (
    <main className="bg-white text-black min-h-screen">
      <Navigation />
      <ProductPageLayout 
        product={mockProduct} 
        similarProducts={similarProducts}
      />
      <Footer />
    </main>
  );
}