import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ProductCategoryLayout from '@/components/shop/ProductCategoryLayout';

interface ProductCategoryPageProps {
  params: Promise<{ category: string }>;
}

// Valid categories for women's products
const validCategories = [
  'bags', 'boots', 'shoes', 'loafers', 'sandals', 'heels', 'flats',
  'handbags', 'totes', 'clutches', 'backpacks', 'shoulder-bags',
  'accessories', 'jewelry', 'scarves', 'belts', 'sunglasses',
  'cosmetics', 'makeup', 'skincare', 'fragrance', 'perfume',
  'clothing', 'dresses', 'tops', 'bottoms', 'outerwear',
  'new', 'sale', 'trending'
];

export async function generateMetadata({ params }: ProductCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  
  if (!validCategories.includes(category)) {
    return {
      title: 'Category Not Found | FEM & FIT',
    };
  }

  const categoryNames = {
    'bags': 'Bags',
    'boots': 'Boots',
    'shoes': 'Shoes',
    'loafers': 'Loafers',
    'sandals': 'Sandals',
    'heels': 'Heels',
    'flats': 'Flats',
    'handbags': 'Handbags',
    'totes': 'Totes',
    'clutches': 'Clutches',
    'backpacks': 'Backpacks',
    'shoulder-bags': 'Shoulder Bags',
    'accessories': 'Accessories',
    'jewelry': 'Jewelry',
    'scarves': 'Scarves',
    'belts': 'Belts',
    'sunglasses': 'Sunglasses',
    'cosmetics': 'Cosmetics',
    'makeup': 'Makeup',
    'skincare': 'Skincare',
    'fragrance': 'Fragrance',
    'perfume': 'Perfume',
    'clothing': 'Clothing',
    'dresses': 'Dresses',
    'tops': 'Tops',
    'bottoms': 'Bottoms',
    'outerwear': 'Outerwear',
    'new': 'New Products',
    'sale': 'Sale',
    'trending': 'Trending'
  };

  return {
    title: `Women's ${categoryNames[category as keyof typeof categoryNames]} | FEM & FIT`,
    description: `Discover our collection of women's ${categoryNames[category as keyof typeof categoryNames].toLowerCase()} designed for Cambodian women. Quality, style, and comfort guaranteed.`,
  };
}

export default async function ProductCategoryPage({ params }: ProductCategoryPageProps) {
  const { category } = await params;

  if (!validCategories.includes(category)) {
    notFound();
  }

  // Mock data for the category
  const categoryData = {
    name: category,
    displayName: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
    description: `Discover our collection of women's ${category.replace('-', ' ')} designed for Cambodian women.`,
    products: generateMockProducts(category)
  };

  return (
    <main className="bg-white text-black min-h-screen">
      <Navigation />
      <ProductCategoryLayout 
        gender="women"
        category={category}
        categoryData={categoryData}
      />
      <Footer />
    </main>
  );
}

function generateMockProducts(category: string) {
  const baseProducts = [
    {
      id: 1,
      name: 'Classic Leather Handbag',
      price: 85000,
      image: '/images/products/handbag-1.jpg',
      colors: ['black', 'brown', 'tan'],
      sizes: ['One Size'],
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Elegant Pointed Toe Heels',
      price: 65000,
      image: '/images/products/heels-1.jpg',
      colors: ['black', 'nude', 'red'],
      sizes: ['36', '37', '38', '39'],
      rating: 4.6,
      reviews: 89
    },
    {
      id: 3,
      name: 'Comfortable Flat Sandals',
      price: 45000,
      image: '/images/products/sandals-1.jpg',
      colors: ['black', 'brown', 'white'],
      sizes: ['36', '37', '38', '39'],
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      name: 'Stylish Crossbody Bag',
      price: 55000,
      image: '/images/products/crossbody-1.jpg',
      colors: ['black', 'navy', 'burgundy'],
      sizes: ['One Size'],
      rating: 4.5,
      reviews: 78
    },
    {
      id: 5,
      name: 'Ankle Boots with Buckle',
      price: 75000,
      image: '/images/products/boots-1.jpg',
      colors: ['black', 'brown', 'tan'],
      sizes: ['36', '37', '38', '39'],
      rating: 4.9,
      reviews: 203
    },
    {
      id: 6,
      name: 'Minimalist Loafers',
      price: 50000,
      image: '/images/products/loafers-1.jpg',
      colors: ['black', 'brown', 'white'],
      sizes: ['36', '37', '38', '39'],
      rating: 4.4,
      reviews: 92
    }
  ];

  // Return products based on category
  return baseProducts.slice(0, 6);
}
