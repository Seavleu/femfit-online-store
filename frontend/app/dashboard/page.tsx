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
  MapPin,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PublicLayout from '@/components/layouts/PublicLayout';
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
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="p-8">
            <CardContent className="text-center">
              <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    { 
      icon: ShoppingBag, 
      label: 'Shop Now', 
      href: '/shop', 
      description: 'Browse our latest collection',
      priority: 'high'
    },
    { 
      icon: Heart, 
      label: 'Wishlist', 
      href: '/wishlist', 
      description: 'Your saved items',
      priority: 'medium'
    },
    { 
      icon: Package, 
      label: 'Orders', 
      href: '/orders', 
      description: 'Track your orders',
      priority: 'high'
    },
    { 
      icon: User, 
      label: 'Profile', 
      href: '/profile', 
      description: 'Manage your account',
      priority: 'medium'
    },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
        {/* Mobile-First Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Welcome back, {user?.user_metadata?.name?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-sm text-gray-500 mt-1">Manage your shopping experience</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/shop">
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    Shop
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Mobile-Optimized Quick Actions */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {quickActions.map((action, index) => (
                <Card key={action.label} className={cn(
                  "group hover:shadow-md transition-all duration-200 border-gray-100",
                  action.priority === 'high' ? "ring-1 ring-gray-200" : ""
                )}>
                  <CardContent className="p-4 sm:p-6">
                    <Link href={action.href} className="block">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 group-hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors">
                          <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                            {action.label}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mobile-First Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-gray-100">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rewards Points</p>
                      <p className="text-2xl font-bold text-gray-900">2,450</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Gift className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-100">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-100">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Member Status</p>
                      <p className="text-2xl font-bold text-gray-900">Gold</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile-Optimized Recent Orders */}
            <Card className="border-gray-100">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Recent Orders</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/orders" className="text-gray-600 hover:text-gray-900">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start shopping to see your orders here</p>
                    <Button asChild className="w-full sm:w-auto">
                      <Link href="/shop">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Start Shopping
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">Order #{order.id.slice(0, 8)}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                          <Badge variant="outline" className="text-xs">
                            {order.status === 'delivered' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {order.status === 'shipped' && <Clock className="w-3 h-3 mr-1" />}
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mobile-Optimized Special Offer */}
            <Card className="bg-gray-900 text-white border-0">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-gray-300" />
                    <span className="text-gray-300 font-medium text-sm">Special Offer</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">
                    Get 20% Off Your Next Purchase
                  </h3>
                  <p className="text-gray-300 mb-6 text-sm sm:text-base">
                    Use code <span className="font-mono bg-white text-gray-900 px-2 py-1 rounded text-sm">SHOPPER20</span> at checkout
                  </p>
                  <Button asChild className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100">
                    <Link href="/shop">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Shop Now
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}