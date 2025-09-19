'use client';

import { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
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
  Filter,
  LogOut,
  User,
  Shield,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import ProductManagement from '@/components/admin/ProductManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import CustomerManagement from '@/components/admin/CustomerManagement';
import InventoryTracking from '@/components/admin/InventoryTracking';
import CMSManagement from '@/components/admin/CMSManagement';
import ReportingAnalytics from '@/components/admin/ReportingAnalytics';
import SettingsConfiguration from '@/components/admin/SettingsConfiguration';
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
  const { user, isAuthenticated, isLoading, logout } = useAdminAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Animation handled by CSS classes
    if (dashboardRef.current) {
      dashboardRef.current.classList.add('animate-fade-in');
    }
  }, []);

  if (isLoading) {
    return (
      <main className="bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'cms', label: 'Content', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AdminLayout>
      <main className="bg-white text-black min-h-screen">
        <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div ref={dashboardRef} className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-playfair font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your FEMFIT store</p>
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 sm:space-x-3 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 sm:px-4 py-2 transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
                <div className="text-left sm:hidden">
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
                <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-1 sm:space-x-8 min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-0 border-b-2 font-medium transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-black"
                  )}
                >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'overview' && (
            <AnalyticsDashboard />
          )}

          {activeTab === 'products' && (
            <ProductManagement />
          )}

          {activeTab === 'orders' && (
            <OrderManagement />
          )}

          {activeTab === 'customers' && (
            <CustomerManagement />
          )}

          {activeTab === 'inventory' && (
            <InventoryTracking />
          )}

          {activeTab === 'cms' && (
            <CMSManagement />
          )}

          {activeTab === 'reports' && (
            <ReportingAnalytics />
          )}

          {activeTab === 'settings' && (
            <SettingsConfiguration />
          )}
        </div>
      </div>
    </main>
    </AdminLayout>
  );
}