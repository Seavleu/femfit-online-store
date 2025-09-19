'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { User, Package, Heart, MapPin, Settings, LogOut, Edit, Plus } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { 
  PageHeader, 
  ContentCard, 
  StatusBadge, 
  EmptyState, 
  LoadingState,
  FormCard 
} from '@/components/design-system';

// Mock data
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'Delivered',
    total: 2850,
    items: [
      { name: 'Signature Collection Handbag', price: 2850, quantity: 1 }
    ]
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'Shipped',
    total: 4200,
    items: [
      { name: 'Limited Edition Watch', price: 4200, quantity: 1 }
    ]
  }
];

const mockAddresses = [
  {
    id: 1,
    type: 'Home',
    name: 'John Doe',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    isDefault: true
  }
];

export default function ProfilePage() {
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { user, loading, signOut } = useSupabaseAuth();
  const router = useRouter();
  const { state } = useCart();
  const [activeTab, setActiveTab] = useState('overview');
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      if (!loading && !user) {
        router.push('/auth/signin');
      }
    } catch (err) {
      console.error('Navigation error:', err);
      setError('Navigation error occurred');
    }
  }, [loading, user, router]);

  if (loading) {
    return <LoadingState text="Loading your profile..." fullScreen />;
  }

  if (!user) {
    return (
      <EmptyState
        icon={<User className="w-16 h-16 text-gray-400" />}
        title="Please Sign In"
        description="You need to sign in to view your profile"
        action={{
          label: 'Sign In',
          onClick: () => router.push('/auth/signin')
        }}
      />
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <main className="bg-white text-black min-h-screen">
        <Navigation />
        
        {/* Page Header */}
        <PageHeader
          title="My Account"
          description={`Welcome back, ${user?.user_metadata?.name || user?.email || 'User'}`}
          actions={
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          }
          className="bg-white"
        />
        
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ContentCard padding="md">
                <nav className="space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? 'bg-black text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </ContentCard>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <ContentCard padding="md">
                      <h3 className="font-space-grotesk font-semibold mb-2">Total Orders</h3>
                      <p className="text-2xl font-bold">{mockOrders.length}</p>
                    </ContentCard>
                    <ContentCard padding="md">
                      <h3 className="font-space-grotesk font-semibold mb-2">Cart Items</h3>
                      <p className="text-2xl font-bold">{state?.itemCount || 0}</p>
                    </ContentCard>
                    <ContentCard padding="md">
                      <h3 className="font-space-grotesk font-semibold mb-2">Wishlist</h3>
                      <p className="text-2xl font-bold">{wishlist.length}</p>
                    </ContentCard>
                  </div>

                  <ContentCard
                    title="Recent Orders"
                    padding="md"
                  >
                    <div className="space-y-4">
                      {mockOrders.slice(0, 3).map(order => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-gray-600">{order.date}</p>
                            </div>
                            <StatusBadge 
                              status={order.status === 'Delivered' ? 'delivered' : 
                                     order.status === 'Shipped' ? 'shipped' : 'processing'} 
                            />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </p>
                          <p className="font-space-grotesk font-bold">${order.total.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </ContentCard>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-space-grotesk font-semibold">Order History</h3>
                    <div className="space-y-4">
                      {mockOrders.map(order => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-space-grotesk font-semibold">{order.id}</h4>
                              <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between">
                                <span>{item.name} × {item.quantity}</span>
                                <span>${item.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <span className="font-space-grotesk font-bold">Total: ${order.total.toFixed(2)}</span>
                            <button className="text-sm text-black hover:text-luxury-gold transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {activeTab === 'wishlist' && (
                <ContentCard
                  title="Wishlist"
                  padding="lg"
                >
                  {wishlist.length === 0 ? (
                    <EmptyState
                      icon={<Heart className="w-16 h-16 text-gray-400" />}
                      title="Your wishlist is empty"
                      description="Start adding items you love to your wishlist"
                      action={{
                        label: 'Browse Products',
                        onClick: () => router.push('/shop')
                      }}
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Wishlist items would go here */}
                    </div>
                  )}
                </ContentCard>
              )}

                {activeTab === 'addresses' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-space-grotesk font-semibold">Saved Addresses</h3>
                      <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 font-medium hover:bg-gray-900 transition-colors rounded-lg">
                        <Plus className="w-4 h-4" />
                        <span>Add Address</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {mockAddresses.map(address => (
                        <div key={address.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-space-grotesk font-semibold">{address.type}</h4>
                                {address.isDefault && (
                                  <span className="px-2 py-1 bg-luxury-gold text-white text-xs rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="font-medium">{address.name}</p>
                              <p className="text-gray-600">{address.address}</p>
                              <p className="text-gray-600">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                            </div>
                            <button className="text-gray-400 hover:text-black transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <ContentCard
                    title="Personal Information"
                    padding="lg"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                          type="text"
                          value={user?.user_metadata?.name || ''}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                          readOnly
                        />
                      </div>
                    </div>
                  </ContentCard>

                  <ContentCard
                    title="Preferences"
                    padding="lg"
                  >
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span>Email notifications for new products</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span>Order status updates</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="w-4 h-4" />
                        <span>Marketing emails</span>
                      </label>
                    </div>
                  </ContentCard>
                </div>
              )}
            </div>
          </div>
        </div>

      <Footer />
    </main>
  );
}