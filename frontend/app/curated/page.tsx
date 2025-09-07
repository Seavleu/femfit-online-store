import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import CuratedCollectionsGrid from '@/components/curated/CuratedCollectionsGrid';

export const metadata: Metadata = {
  title: 'Curated Collections | FEM & FIT',
  description: 'Discover our seasonal collections curated specifically for Cambodian women. From dry season essentials to wet season protection.',
};

export default function CuratedPage() {
  return (
    <main className="bg-white text-black min-h-screen">
      <Navigation />
      <CuratedCollectionsGrid />
      <Footer />
    </main>
  );
}
