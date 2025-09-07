import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ProductCategoryLayout from '@/components/shop/ProductCategoryLayout';

interface ProductCategoryPageProps {
  params: Promise<{ category: string }>;
}

// Valid categories for men's products
const validCategories = [
  'shoes', 'boots', 'sneakers', 'loafers', 'sandals', 'dress-shoes',
  'bags', 'backpacks', 'messenger-bags', 'briefcases', 'duffel-bags',
  'accessories', 'belts', 'wallets', 'sunglasses', 'watches', 'ties',
  'clothing', 'shirts', 'pants', 'suits', 'jackets', 't-shirts',
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
    'shoes': 'Shoes',
    'boots': 'Boots',
    'sneakers': 'Sneakers',
    'loafers': 'Loafers',
    'sandals': 'Sandals',
    'dress-shoes': 'Dress Shoes',
    'bags': 'Bags',
    'backpacks': 'Backpacks',
    'messenger-bags': 'Messenger Bags',
    'briefcases': 'Briefcases',
    'duffel-bags': 'Duffel Bags',
    'accessories': 'Accessories',
    'belts': 'Belts',
    'wallets': 'Wallets',
    'sunglasses': 'Sunglasses',
    'watches': 'Watches',
    'ties': 'Ties',
    'clothing': 'Clothing',
    'shirts': 'Shirts',
    'pants': 'Pants',
    'suits': 'Suits',
    'jackets': 'Jackets',
    't-shirts': 'T-Shirts',
    'new': 'New Products',
    'sale': 'Sale',
    'trending': 'Trending'
  };

  return {
    title: `Men's ${categoryNames[category as keyof typeof categoryNames]} | FEM & FIT`,
    description: `Discover our collection of men's ${categoryNames[category as keyof typeof categoryNames].toLowerCase()} designed for modern men. Quality, style, and comfort guaranteed.`,
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
    description: `Discover our collection of men's ${category.replace('-', ' ')} designed for modern men.`,
    products: generateMockProducts(category)
  };

  return (
    <main className="bg-white text-black min-h-screen">
      <Navigation />
      <ProductCategoryLayout 
        gender="men"
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
      name: 'Classic Leather Dress Shoes',
      price: 95000,
      image: '/images/products/dress-shoes-1.jpg',
      colors: ['black', 'brown', 'oxblood'],
      sizes: ['40', '41', '42', '43', '44'],
      rating: 4.7,
      reviews: 89
    },
    {
      id: 2,
      name: 'Premium Leather Wallet',
      price: 45000,
      image: '/images/products/wallet-1.jpg',
      colors: ['black', 'brown', 'tan'],
      sizes: ['One Size'],
      rating: 4.5,
      reviews: 156
    },
    {
      id: 3,
      name: 'Business Briefcase',
      price: 125000,
      image: '/images/products/briefcase-1.jpg',
      colors: ['black', 'brown', 'navy'],
      sizes: ['One Size'],
      rating: 4.8,
      reviews: 67
    },
    {
      id: 4,
      name: 'Casual Sneakers',
      price: 65000,
      image: '/images/products/sneakers-1.jpg',
      colors: ['white', 'black', 'navy'],
      sizes: ['40', '41', '42', '43', '44'],
      rating: 4.6,
      reviews: 203
    },
    {
      id: 5,
      name: 'Leather Belt',
      price: 35000,
      image: '/images/products/belt-1.jpg',
      colors: ['black', 'brown', 'tan'],
      sizes: ['32', '34', '36', '38', '40'],
      rating: 4.4,
      reviews: 124
    },
    {
      id: 6,
      name: 'Canvas Backpack',
      price: 55000,
      image: '/images/products/backpack-1.jpg',
      colors: ['black', 'navy', 'olive'],
      sizes: ['One Size'],
      rating: 4.7,
      reviews: 92
    }
  ];

  // Return products based on category
  return baseProducts.slice(0, 6);
}
