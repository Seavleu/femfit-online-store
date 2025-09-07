'use client';

import { useState, useEffect, useRef } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Search,
  Filter
} from 'lucide-react';
import gsap from 'gsap';
import Navigation from '@/components/layout/Navigation';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

// Mock data
const mockStats = {
  totalProducts: products.length,
  totalOrders: 127,
  totalCustomers: 89,
  totalRevenue: 45280
};

const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    date: '2024-01-15',
    status: 'Delivered',
    total: 2850,
    items: 2
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    date: '2024-01-14',
    status: 'Shipped',
    total: 4200,
    items: 1
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    date: '2024-01-13',
    status: 'Processing',
    total: 1850,
    items: 3
  }
];

export default function AdminDashboard() {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/signin');
      }
      // Note: Role-based routing can be added back once user roles are stored in Supabase metadata
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (dashboardRef.current) {
      gsap.fromTo(dashboardRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  if (loading) {
    return (
      <main className="bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Date', 'Status', 'Total', 'Items'],
      ...mockOrders.map(order => [
        order.id,
        order.customer,
        order.email,
        order.date,
        order.status,
        order.total,
        order.items
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="bg-white text-black min-h-screen">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-16">
        <div ref={dashboardRef} className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-playfair font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your FEMFIT store</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors",
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-black"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-space-grotesk font-semibold text-gray-600">Products</h3>
                    <Package className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <p className="text-2xl font-bold">{mockStats.totalProducts}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-space-grotesk font-semibold text-gray-600">Orders</h3>
                    <ShoppingCart className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <p className="text-2xl font-bold">{mockStats.totalOrders}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-space-grotesk font-semibold text-gray-600">Customers</h3>
                    <Users className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <p className="text-2xl font-bold">{mockStats.totalCustomers}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-space-grotesk font-semibold text-gray-600">Revenue</h3>
                    <TrendingUp className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <p className="text-2xl font-bold">${mockStats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h3 className="text-xl font-space-grotesk font-semibold mb-4">Recent Orders</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {mockOrders.slice(0, 5).map(order => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="font-medium">{order.id}</div>
                                <div className="text-sm text-gray-500">{order.date}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="font-medium">{order.customer}</div>
                                <div className="text-sm text-gray-500">{order.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={cn(
                                "px-2 py-1 text-xs font-medium rounded-full",
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              )}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button className="text-gray-400 hover:text-black transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 font-medium hover:bg-gray-900 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      <p className="font-space-grotesk font-bold mb-3">
                        ${product.price.usd.toFixed(2)} / ៛{product.price.khr.toLocaleString()}
                      </p>
                      <div className="flex space-x-2">
                        <button className="flex-1 text-sm border border-gray-200 py-2 px-3 hover:border-black transition-colors flex items-center justify-center">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button className="text-sm text-red-600 border border-red-200 py-2 px-3 hover:border-red-600 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-xl font-space-grotesk font-semibold">All Orders</h3>
                <button
                  onClick={exportOrders}
                  className="flex items-center space-x-2 border border-gray-200 px-4 py-2 font-medium hover:border-black transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockOrders.map(order => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium">{order.customer}</div>
                              <div className="text-sm text-gray-500">{order.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-black">
                              <option value="Processing" selected={order.status === 'Processing'}>Processing</option>
                              <option value="Shipped" selected={order.status === 'Shipped'}>Shipped</option>
                              <option value="Delivered" selected={order.status === 'Delivered'}>Delivered</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{order.items}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">${order.total.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="text-gray-400 hover:text-black transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-black transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6">
              <h3 className="text-xl font-space-grotesk font-semibold">Customer Management</h3>
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Customer management features coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}