'use client';

import { useState, useRef, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Settings,
  BarChart3,
  DollarSign,
  X,
  Upload,
  Save
} from 'lucide-react';
import { products } from '@/data/products';
// TODO: replace with server APIs; avoid importing DB in client
import { getProducts, getOrders, createProduct, updateProduct, deleteProduct } from '@/lib/database';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Enhanced mock data for admin dashboard
const mockStats = {
  totalProducts: products.length,
  totalOrders: 247,
  totalCustomers: 156,
  totalRevenue: 89750,
  monthlyGrowth: 18.5,
  weeklyOrders: 34,
  pendingOrders: 12,
  completedOrders: 235
};

const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    date: '2024-01-15',
    status: 'Delivered',
    total: 2850,
    items: 2,
    paymentMethod: 'Credit Card',
    shippingAddress: '123 Main St, New York, NY'
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    date: '2024-01-14',
    status: 'Shipped',
    total: 4200,
    items: 1,
    paymentMethod: 'PayPal',
    shippingAddress: '456 Oak Ave, Los Angeles, CA'
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    date: '2024-01-13',
    status: 'Processing',
    total: 1850,
    items: 3,
    paymentMethod: 'ABA PayWay',
    shippingAddress: '789 Pine Rd, Chicago, IL'
  }
];

interface ProductFormData {
  id?: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
  tags: string[];
  sizes: string[];
  material: string;
  care: string[];
  stock: number;
}

const initialFormData: ProductFormData = {
  name: '',
  price: '',
  image: '',
  description: '',
  category: '',
  tags: [],
  sizes: [],
  material: '',
  care: [],
  stock: 0
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [productList, setProductList] = useState<ProductFormData[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useSupabaseAuth();
  const router = useRouter();

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
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [productsResult, ordersResult] = await Promise.all([
        getProducts(),
        getOrders()
      ]);
      
      if (productsResult.data) setProductList(productsResult.data);
      if (ordersResult.data) setOrders(ordersResult.data);
    } catch (error) {
      // Handle error silently or show user-friendly message
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const categories = ['Accessories', 'Clothing', 'Jewelry', 'Home', 'Bags'];
  const availableTags = ['New', 'Popular', 'Limited Edition', 'Bestseller', 'Sustainable'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

  const filteredProducts = productList.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setShowAddProductModal(true);
  };

  const handleEditProduct = (product: ProductFormData) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      tags: product.tags || [],
      sizes: product.sizes || [],
      material: product.material || '',
      care: product.care || [],
      stock: product.stock || 0
    });
    setShowAddProductModal(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      toast.success('Product deleted successfully');
      loadData();
    }
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price.replace(/[$,]/g, '')),
        image_url: formData.image,
        category: formData.category,
        stock: formData.stock
      };

      if (editingProduct && editingProduct.id) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product added successfully');
      }

      setShowAddProductModal(false);
      setFormData(initialFormData);
      setEditingProduct(null);
      loadData();
    } catch (error) {
      toast.error('Error saving product');
      console.error('Error saving product:', error);
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (authLoading || !user || user.user_metadata?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold">FEMFIT Admin</Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.user_metadata?.name || user?.email}</span>
              <Link href="/api/auth/signout" className="text-red-600 hover:text-red-800">Sign Out</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-playfair font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your FEMFIT store</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <button 
                onClick={handleAddProduct}
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 font-medium hover:bg-gray-900 transition-colors rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-blue-600 font-medium">+5.2%</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-900">{productList.length}</h3>
              <p className="text-blue-700 text-sm">Total Products</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 font-medium">+12.3%</span>
              </div>
              <h3 className="text-2xl font-bold text-green-900">{mockStats.totalOrders}</h3>
              <p className="text-green-700 text-sm">Total Orders</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-purple-600 font-medium">+8.1%</span>
              </div>
              <h3 className="text-2xl font-bold text-purple-900">{mockStats.totalCustomers}</h3>
              <p className="text-purple-700 text-sm">Total Customers</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-orange-600 font-medium">+{mockStats.monthlyGrowth}%</span>
              </div>
              <h3 className="text-2xl font-bold text-orange-900">${mockStats.totalRevenue.toLocaleString()}</h3>
              <p className="text-orange-700 text-sm">Total Revenue</p>
            </div>
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
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="font-space-grotesk font-semibold text-gray-600 mb-2">This Week</h3>
                  <p className="text-2xl font-bold">{mockStats.weeklyOrders} Orders</p>
                  <p className="text-sm text-green-600">+15% from last week</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="font-space-grotesk font-semibold text-gray-600 mb-2">Pending</h3>
                  <p className="text-2xl font-bold">{mockStats.pendingOrders} Orders</p>
                  <p className="text-sm text-yellow-600">Requires attention</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="font-space-grotesk font-semibold text-gray-600 mb-2">Completed</h3>
                  <p className="text-2xl font-bold">{mockStats.completedOrders} Orders</p>
                  <p className="text-sm text-green-600">All time</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-space-grotesk font-semibold">Recent Orders</h3>
                  <button className="text-sm text-gray-500 hover:text-black transition-colors">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {mockOrders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.total.toFixed(2)}</p>
                        <span className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        )}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
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
                <button 
                  onClick={handleAddProduct}
                  className="flex items-center space-x-2 bg-black text-white px-4 py-2 font-medium hover:bg-gray-900 transition-colors rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1 truncate">{(product as any).name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{(product as any).category}</p>
                      <p className="font-space-grotesk font-bold mb-3">{(product as any).price}</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 text-sm border border-gray-200 py-2 px-3 hover:border-black transition-colors flex items-center justify-center rounded-lg"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => product.id && handleDeleteProduct(product.id)}
                          className="text-sm text-red-600 border border-red-200 py-2 px-3 hover:border-red-600 transition-colors rounded-lg"
                          disabled={!product.id}
                        >
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
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium">#{order.id.slice(0, 8)}</div>
                              <div className="text-sm text-gray-500">{order.order_items?.length || 0} items</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium">{order.users?.name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{order.users?.email || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-black">
                              <option value="Pending" selected={order.status === 'Pending'}>Pending</option>
                              <option value="Processing" selected={order.status === 'Processing'}>Processing</option>
                              <option value="Shipped" selected={order.status === 'Shipped'}>Shipped</option>
                              <option value="Delivered" selected={order.status === 'Delivered'}>Delivered</option>
                            </select>
                          </td>
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

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-xl font-space-grotesk font-semibold">Settings</h3>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Management</h3>
                <p className="text-gray-500">Configure store settings, payment methods, and more</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-playfair font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price *</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="$0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                  rows={3}
                  placeholder="Product description"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Material</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="e.g., 100% Cotton, Leather"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={cn(
                        "px-3 py-1 text-sm rounded-full transition-colors",
                        formData.tags.includes(tag)
                          ? "bg-luxury-gold text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sizes</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={cn(
                        "py-2 px-3 text-sm border rounded-lg transition-colors",
                        formData.sizes.includes(size)
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 border border-gray-200 py-3 px-6 font-medium hover:border-black transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 px-6 font-medium hover:bg-gray-900 transition-colors rounded-lg flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}