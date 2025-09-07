import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import CuratedCollectionLayout from '@/components/curated/CuratedCollectionLayout';

interface CuratedPageProps {
  params: Promise<{ season: string }>;
}

// Valid seasons for Cambodia
const validSeasons = ['dry-season', 'wet-season', 'cool-season', 'hot-season'];

export async function generateMetadata({ params }: CuratedPageProps): Promise<Metadata> {
  const { season } = await params;
  
  if (!validSeasons.includes(season)) {
    return {
      title: 'Collection Not Found | FEM & FIT',
    };
  }

  const seasonNames = {
    'dry-season': 'Dry Season Collection',
    'wet-season': 'Wet Season Collection', 
    'cool-season': 'Cool Season Collection',
    'hot-season': 'Hot Season Collection'
  };

  return {
    title: `${seasonNames[season as keyof typeof seasonNames]} | FEM & FIT`,
    description: `Discover our curated ${seasonNames[season as keyof typeof seasonNames]} featuring the latest trends and essentials for Cambodian women.`,
  };
}

export default async function CuratedPage({ params }: CuratedPageProps) {
  const { season } = await params;

  if (!validSeasons.includes(season)) {
    notFound();
  }

  // Mock data for the curated collection
  const collectionData = {
    'dry-season': {
      title: 'DRY SEASON COLLECTION',
      subtitle: 'Light & Breathable Essentials',
      description: 'Perfect for Cambodia\'s dry season with lightweight, breathable fabrics and versatile pieces.',
      heroImage: '/images/collections/dry-season.jpg',
      products: [
        {
          id: 1,
          name: 'Lightweight Cotton Blouse',
          price: 45000,
          image: '/images/products/cotton-blouse.jpg',
          colors: ['white', 'beige', 'light-blue']
        },
        {
          id: 2,
          name: 'Breathable Linen Pants',
          price: 55000,
          image: '/images/products/linen-pants.jpg',
          colors: ['cream', 'khaki', 'navy']
        },
        {
          id: 3,
          name: 'Cotton Maxi Dress',
          price: 65000,
          image: '/images/products/maxi-dress.jpg',
          colors: ['floral', 'solid-blue', 'striped']
        },
        {
          id: 4,
          name: 'Lightweight Cardigan',
          price: 40000,
          image: '/images/products/cardigan.jpg',
          colors: ['white', 'pink', 'mint']
        }
      ]
    },
    'wet-season': {
      title: 'WET SEASON COLLECTION',
      subtitle: 'Water-Resistant & Quick-Dry',
      description: 'Stay comfortable during Cambodia\'s rainy season with water-resistant materials and quick-dry fabrics.',
      heroImage: '/images/collections/wet-season.jpg',
      products: [
        {
          id: 5,
          name: 'Water-Resistant Jacket',
          price: 75000,
          image: '/images/products/rain-jacket.jpg',
          colors: ['black', 'navy', 'red']
        },
        {
          id: 6,
          name: 'Quick-Dry Trousers',
          price: 50000,
          image: '/images/products/quick-dry-pants.jpg',
          colors: ['black', 'charcoal', 'olive']
        },
        {
          id: 7,
          name: 'Waterproof Tote Bag',
          price: 35000,
          image: '/images/products/waterproof-bag.jpg',
          colors: ['clear', 'black', 'blue']
        },
        {
          id: 8,
          name: 'Rubber Sole Boots',
          price: 85000,
          image: '/images/products/rain-boots.jpg',
          colors: ['black', 'brown', 'navy']
        }
      ]
    },
    'cool-season': {
      title: 'COOL SEASON COLLECTION',
      subtitle: 'Layered & Cozy',
      description: 'Embrace Cambodia\'s cooler months with layered pieces and cozy essentials.',
      heroImage: '/images/collections/cool-season.jpg',
      products: [
        {
          id: 9,
          name: 'Wool Blend Sweater',
          price: 60000,
          image: '/images/products/wool-sweater.jpg',
          colors: ['cream', 'gray', 'burgundy']
        },
        {
          id: 10,
          name: 'Fleece Lined Jacket',
          price: 70000,
          image: '/images/products/fleece-jacket.jpg',
          colors: ['black', 'navy', 'olive']
        },
        {
          id: 11,
          name: 'Knit Scarf',
          price: 25000,
          image: '/images/products/scarf.jpg',
          colors: ['plaid', 'solid-gray', 'striped']
        },
        {
          id: 12,
          name: 'Warm Leggings',
          price: 30000,
          image: '/images/products/leggings.jpg',
          colors: ['black', 'gray', 'navy']
        }
      ]
    },
    'hot-season': {
      title: 'HOT SEASON COLLECTION',
      subtitle: 'Ultra-Light & Airy',
      description: 'Beat Cambodia\'s intense heat with ultra-lightweight, airy fabrics and cooling designs.',
      heroImage: '/images/collections/hot-season.jpg',
      products: [
        {
          id: 13,
          name: 'Mesh Top',
          price: 35000,
          image: '/images/products/mesh-top.jpg',
          colors: ['white', 'black', 'coral']
        },
        {
          id: 14,
          name: 'Linen Shorts',
          price: 40000,
          image: '/images/products/linen-shorts.jpg',
          colors: ['white', 'beige', 'navy']
        },
        {
          id: 15,
          name: 'Cotton Tank Top',
          price: 25000,
          image: '/images/products/tank-top.jpg',
          colors: ['white', 'black', 'striped']
        },
        {
          id: 16,
          name: 'Breathable Sandals',
          price: 45000,
          image: '/images/products/sandals.jpg',
          colors: ['black', 'brown', 'white']
        }
      ]
    }
  };

  const collection = collectionData[season as keyof typeof collectionData];

  return (
    <main className="bg-white text-black min-h-screen">
      <Navigation />
      <CuratedCollectionLayout 
        season={season}
        collection={collection}
      />
      <Footer />
    </main>
  );
}
