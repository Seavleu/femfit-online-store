'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

interface WishlistItem {
  _id: string;
  productId: string;
  addedAt: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
  };
}

interface Wishlist {
  _id: string;
  userId: string;
  items: WishlistItem[];
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export default function WishlistPage() {
  const { user, loading: authLoading } = useSupabaseAuth();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error('Please sign in to view your wishlist');
      router.push('/auth/signin');
      return;
    }

    loadWishlist();
  }, [authLoading, user, router]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wishlist', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist);
      } else {
        toast.error('Failed to load wishlist');
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      setRemovingItems(prev => new Set(prev).add(productId));
      
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        // Update local state
        if (wishlist) {
          const updatedItems = wishlist.items.filter(
            item => item.productId !== productId
          );
          setWishlist({
            ...wishlist,
            items: updatedItems,
            totalItems: updatedItems.length
          });
        }
        toast.success('Item removed from wishlist');
      } else {
        toast.error('Failed to remove item from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      });

      if (response.ok) {
        toast.success('Added to cart');
        // Optionally remove from wishlist after adding to cart
        // await removeFromWishlist(productId);
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (authLoading) {
    return (
      <main className="bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="bg-white text-black min-h-screen">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-600">Save your favorite products for later</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        ) : !wishlist || wishlist.items.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-space-grotesk font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Start adding products you love to your wishlist</p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors rounded-lg"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Wishlist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.items.map((item) => (
                <div key={item._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <Image
                      src={item.product.image || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-space-grotesk font-semibold text-gray-900 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="font-space-grotesk font-bold text-lg">
                        ${item.product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => addToCart(item.productId)}
                        className="flex-1 bg-black hover:bg-gray-900 transition-colors"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => removeFromWishlist(item.productId)}
                        disabled={removingItems.has(item.productId)}
                        className="border-gray-300 hover:border-red-500 hover:text-red-500 transition-colors"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Wishlist Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-space-grotesk font-semibold text-gray-900">
                    Wishlist Summary
                  </h3>
                  <p className="text-gray-600">
                    {wishlist.totalItems} item{wishlist.totalItems !== 1 ? 's' : ''} in your wishlist
                  </p>
                </div>
                
                <Link
                  href="/shop"
                  className="flex items-center space-x-2 bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors rounded-lg"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
