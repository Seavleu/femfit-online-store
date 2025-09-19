'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Package, 
  Star,
  TrendingUp,
  Gift,
  Sparkles,
  CreditCard,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
// Removed direct DB import; fetch from server API
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ShopperDashboard() {
  const { user, loading: authLoading } = useSupabaseAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/signin');
      }
      // Note: Role-based routing can be added back once user roles are stored in Supabase metadata
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/dashboard', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      setOrders(json.orders || []);
    } catch (error) {
      // Handle error silently or show user-friendly message
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    { icon: ShoppingBag, label: 'Shop Now', href: '/shop', color: 'bg-blue-500' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', color: 'bg-red-500' },
    { icon: Package, label: 'Orders', href: '/orders', color: 'bg-green-500' },
    { icon: User, label: 'Profile', href: '/profile', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold">FEMFIT</Link>
            <div className="flex items-center space-x-4">
              <Link href="/shop" className="text-gray-600 hover:text-black">Shop</Link>
              <Link href="/orders" className="text-gray-600 hover:text-black">Orders</Link>
              <Link href="/profile" className="text-gray-600 hover:text-black">Profile</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-luxury-gold" />
              <span className="text-luxury-gold font-medium">Welcome Back</span>
              <Sparkles className="w-6 h-6 text-luxury-gold" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-playfair font-bold">
              Hello, {user?.user_metadata?.name || user?.email || 'User'}!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our latest luxury collections and manage your shopping experience.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.label}
                href={action.href}
                className="group p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105"
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
              <p className="text-2xl font-bold">{orders.length}</p>
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

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-playfair font-bold">Recent Orders</h2>
              <Link
                href="/orders"
                className="text-luxury-gold hover:text-black transition-colors font-medium"
              >
                View All →
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Link
                  href="/shop"
                  className="inline-block bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors rounded-lg"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total.toFixed(2)}</p>
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      )}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                  Use code <span className="font-mono bg-luxury-gold text-black px-2 py-1 rounded">SHOPPER20</span> at checkout
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
    </div>
  );
}