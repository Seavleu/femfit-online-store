'use client';

import { useRef } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Package, 
  Star,
  TrendingUp,
  Gift,
  Sparkles
} from 'lucide-react';
// GSAP removed - using CSS animations instead
import Link from 'next/link';
import PrivateLayout from '@/components/layouts/PrivateLayout';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

export default function UserHomePage() {
  const featuredProducts = products.slice(0, 6);
  const quickActions = [
    { icon: ShoppingBag, label: 'Shop Now', href: '/shop', color: 'bg-blue-500' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', color: 'bg-red-500' },
    { icon: Package, label: 'Orders', href: '/profile', color: 'bg-green-500' },
    { icon: User, label: 'Profile', href: '/profile', color: 'bg-purple-500' },
  ];

  return (
    <PrivateLayout requiredRole="user">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-16">
        <div className="space-y-12">
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-luxury-gold" />
              <span className="text-luxury-gold font-medium">Welcome Back</span>
              <Sparkles className="w-6 h-6 text-luxury-gold" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-playfair font-bold">
              Hello, User!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our latest luxury collections curated just for you.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.label}
                href={action.href}
                className="group p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform",
                  action.color
                )}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-space-grotesk font-semibold text-center">{action.label}</h3>
              </Link>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-luxury-sand to-luxury-gold/20 p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-luxury-gold rounded-lg">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-space-grotesk font-semibold">Rewards Points</h3>
              </div>
              <p className="text-2xl font-bold">2,450</p>
              <p className="text-sm text-gray-600">Available to redeem</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-space-grotesk font-semibold">Total Orders</h3>
              </div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-gray-600">Lifetime purchases</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-space-grotesk font-semibold">Member Status</h3>
              </div>
              <p className="text-2xl font-bold">Gold</p>
              <p className="text-sm text-gray-600">VIP member benefits</p>
            </div>
          </div>

          {/* Featured Products */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-playfair font-bold mb-2">Featured for You</h2>
                <p className="text-gray-600">Handpicked luxury items based on your preferences</p>
              </div>
              <Link
                href="/shop"
                className="text-luxury-gold hover:text-black transition-colors font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-xl">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Tags */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {product.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-black text-xs font-medium rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Quick Add Button */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-3 bg-black text-white rounded-full hover:bg-luxury-gold hover:text-black transition-colors shadow-lg">
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-space-grotesk font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="font-space-grotesk font-bold">
                        <span className="mr-2">${product.price.usd.toLocaleString()}</span>
                        <span className="text-xs text-gray-400">/ {product.price.khr.toLocaleString()}៛</span>
                      </div>
                      <Link
                        href={`/shop/${product.id}`}
                        className="text-sm text-luxury-gold hover:text-black transition-colors"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Offers */}
          <div className="bg-gradient-to-r from-luxury-charcoal to-black text-white p-8 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-luxury-gold" />
                </div>
                <h3 className="text-2xl font-playfair font-bold mb-2">
                  Get 20% Off Your Next Purchase
                </h3>
                <p className="text-gray-300 mb-4">
                  Use code <span className="font-mono bg-luxury-gold text-black px-2 py-1 rounded">USER20</span> at checkout
                </p>
              </div>
              <Link
                href="/shop"
                className="bg-luxury-gold text-black px-6 py-3 font-medium hover:bg-white transition-colors rounded-lg"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}