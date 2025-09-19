'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  MoreHorizontal
} from 'lucide-react'

interface InventoryItem {
  id: string
  productId: string
  productName: string
  sku: string
  currentStock: number
  reservedStock: number
  availableStock: number
  minStockLevel: number
  maxStockLevel: number
  reorderPoint: number
  reorderQuantity: number
  cost: number
  price: number
  category: string
  supplier: string
  lastRestocked: string
  lastSold: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
  alerts: string[]
  location: string
  notes?: string
}

interface InventoryFilters {
  status: string[]
  category: string[]
  supplier: string[]
  search: string
  minStock: number
  maxStock: number
  alerts: string[]
}

interface InventoryAlert {
  id: string
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'reorder' | 'expiry'
  severity: 'low' | 'medium' | 'high' | 'critical'
  productId: string
  productName: string
  message: string
  createdAt: string
  isRead: boolean
  actionRequired: boolean
}

export default function InventoryTracking() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<InventoryFilters>({
    status: [],
    category: [],
    supplier: [],
    search: '',
    minStock: 0,
    maxStock: 1000,
    alerts: []
  })
  const [sortBy, setSortBy] = useState('productName')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [activeTab, setActiveTab] = useState<'inventory' | 'alerts' | 'reports'>('inventory')

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        productId: 'prod-1',
        productName: 'Women\'s FlexFit Gym Leggings',
        sku: 'LG-WOMEN-001',
        currentStock: 45,
        reservedStock: 5,
        availableStock: 40,
        minStockLevel: 20,
        maxStockLevel: 100,
        reorderPoint: 25,
        reorderQuantity: 50,
        cost: 25.00,
        price: 49.99,
        category: 'Activewear',
        supplier: 'Fitness Supplies Co.',
        lastRestocked: '2024-01-10T10:00:00Z',
        lastSold: '2024-01-19T14:30:00Z',
        status: 'in_stock',
        alerts: [],
        location: 'Warehouse A - Section 1',
        notes: 'High demand item'
      },
      {
        id: '2',
        productId: 'prod-2',
        productName: 'Men\'s Performance Shorts',
        sku: 'SH-MEN-001',
        currentStock: 8,
        reservedStock: 2,
        availableStock: 6,
        minStockLevel: 15,
        maxStockLevel: 80,
        reorderPoint: 20,
        reorderQuantity: 40,
        cost: 18.00,
        price: 39.99,
        category: 'Activewear',
        supplier: 'Sports Gear Inc.',
        lastRestocked: '2024-01-05T09:00:00Z',
        lastSold: '2024-01-19T11:15:00Z',
        status: 'low_stock',
        alerts: ['low_stock'],
        location: 'Warehouse A - Section 2',
        notes: 'Reorder needed soon'
      },
      {
        id: '3',
        productId: 'prod-3',
        productName: 'Yoga Mat Pro',
        sku: 'YM-PRO-001',
        currentStock: 0,
        reservedStock: 0,
        availableStock: 0,
        minStockLevel: 10,
        maxStockLevel: 50,
        reorderPoint: 15,
        reorderQuantity: 25,
        cost: 20.00,
        price: 49.99,
        category: 'Accessories',
        supplier: 'Yoga Essentials Ltd.',
        lastRestocked: '2023-12-15T14:00:00Z',
        lastSold: '2024-01-18T16:45:00Z',
        status: 'out_of_stock',
        alerts: ['out_of_stock', 'reorder'],
        location: 'Warehouse B - Section 3',
        notes: 'Out of stock - urgent reorder needed'
      },
      {
        id: '4',
        productId: 'prod-4',
        productName: 'Sports Bra High Support',
        sku: 'SB-HIGH-001',
        currentStock: 120,
        reservedStock: 10,
        availableStock: 110,
        minStockLevel: 30,
        maxStockLevel: 150,
        reorderPoint: 40,
        reorderQuantity: 60,
        cost: 15.00,
        price: 29.99,
        category: 'Activewear',
        supplier: 'Fitness Supplies Co.',
        lastRestocked: '2024-01-15T11:30:00Z',
        lastSold: '2024-01-19T13:20:00Z',
        status: 'in_stock',
        alerts: [],
        location: 'Warehouse A - Section 1',
        notes: 'Well stocked'
      },
      {
        id: '5',
        productId: 'prod-5',
        productName: 'Running Shoes Lightweight',
        sku: 'RS-LIGHT-001',
        currentStock: 25,
        reservedStock: 3,
        availableStock: 22,
        minStockLevel: 20,
        maxStockLevel: 60,
        reorderPoint: 25,
        reorderQuantity: 30,
        cost: 45.00,
        price: 89.99,
        category: 'Footwear',
        supplier: 'Shoe Masters Inc.',
        lastRestocked: '2024-01-12T08:45:00Z',
        lastSold: '2024-01-19T10:10:00Z',
        status: 'in_stock',
        alerts: [],
        location: 'Warehouse C - Section 4',
        notes: 'Good stock level'
      }
    ]

    const mockAlerts: InventoryAlert[] = [
      {
        id: 'alert-1',
        type: 'low_stock',
        severity: 'medium',
        productId: 'prod-2',
        productName: 'Men\'s Performance Shorts',
        message: 'Stock level is below minimum threshold (8/15)',
        createdAt: '2024-01-19T10:00:00Z',
        isRead: false,
        actionRequired: true
      },
      {
        id: 'alert-2',
        type: 'out_of_stock',
        severity: 'high',
        productId: 'prod-3',
        productName: 'Yoga Mat Pro',
        message: 'Product is out of stock and needs immediate reorder',
        createdAt: '2024-01-18T16:45:00Z',
        isRead: false,
        actionRequired: true
      },
      {
        id: 'alert-3',
        type: 'reorder',
        severity: 'medium',
        productId: 'prod-3',
        productName: 'Yoga Mat Pro',
        message: 'Reorder point reached - 25 units recommended',
        createdAt: '2024-01-18T16:45:00Z',
        isRead: true,
        actionRequired: true
      },
      {
        id: 'alert-4',
        type: 'overstock',
        severity: 'low',
        productId: 'prod-4',
        productName: 'Sports Bra High Support',
        message: 'Stock level is above maximum threshold (120/150)',
        createdAt: '2024-01-15T11:30:00Z',
        isRead: true,
        actionRequired: false
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setInventory(mockInventory)
      setAlerts(mockAlerts)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and sort inventory
  const filteredInventory = inventory.filter(item => {
    // Search filter
    if (filters.search && !item.productName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !item.sku.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(item.status)) {
      return false
    }
    
    // Category filter
    if (filters.category.length > 0 && !filters.category.includes(item.category)) {
      return false
    }
    
    // Supplier filter
    if (filters.supplier.length > 0 && !filters.supplier.includes(item.supplier)) {
      return false
    }
    
    // Stock range filter
    if (item.currentStock < filters.minStock || item.currentStock > filters.maxStock) {
      return false
    }
    
    return true
  }).sort((a, b) => {
    let aValue = a[sortBy as keyof InventoryItem]
    let bValue = b[sortBy as keyof InventoryItem]
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredInventory.map(item => item.id))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) return
    
    try {
      console.log(`Bulk ${action} for items:`, selectedItems)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSelectedItems([])
      alert(`Successfully ${action}ed ${selectedItems.length} items`)
    } catch (error) {
      console.error(`Bulk ${action} error:`, error)
      alert(`Failed to ${action} items`)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'low_stock': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'out_of_stock': return <XCircle className="w-4 h-4 text-red-500" />
      case 'discontinued': return <XCircle className="w-4 h-4 text-gray-500" />
      default: return <Package className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800'
      case 'low_stock': return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      case 'discontinued': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading inventory...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Inventory Tracking</h2>
          <p className="text-gray-600">Monitor stock levels and manage inventory alerts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Inventory
          </Button>
          <Button>
            <Package className="w-4 h-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {inventory.filter(item => item.status === 'in_stock').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {inventory.filter(item => item.status === 'low_stock').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {inventory.filter(item => item.status === 'out_of_stock').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'alerts', label: 'Alerts', icon: Bell },
            { id: 'reports', label: 'Reports', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {tab.id === 'alerts' && alerts.filter(a => !a.isRead).length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {alerts.filter(a => !a.isRead).length}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'inventory' && (
        <>
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filters & Search</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                  >
                    {viewMode === 'table' ? 'Card View' : 'Table View'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products by name or SKU..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <div className="space-y-2">
                        {['in_stock', 'low_stock', 'out_of_stock', 'discontinued'].map(status => (
                          <label key={status} className="flex items-center space-x-2">
                            <Checkbox
                              checked={filters.status.includes(status)}
                              onCheckedChange={(checked) => {
                                setFilters(prev => ({
                                  ...prev,
                                  status: checked 
                                    ? [...prev.status, status]
                                    : prev.status.filter(s => s !== status)
                                }))
                              }}
                            />
                            <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <div className="space-y-2">
                        {['Activewear', 'Accessories', 'Footwear'].map(category => (
                          <label key={category} className="flex items-center space-x-2">
                            <Checkbox
                              checked={filters.category.includes(category)}
                              onCheckedChange={(checked) => {
                                setFilters(prev => ({
                                  ...prev,
                                  category: checked 
                                    ? [...prev.category, category]
                                    : prev.category.filter(c => c !== category)
                                }))
                              }}
                            />
                            <span className="text-sm">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Supplier</label>
                      <div className="space-y-2">
                        {['Fitness Supplies Co.', 'Sports Gear Inc.', 'Yoga Essentials Ltd.', 'Shoe Masters Inc.'].map(supplier => (
                          <label key={supplier} className="flex items-center space-x-2">
                            <Checkbox
                              checked={filters.supplier.includes(supplier)}
                              onCheckedChange={(checked) => {
                                setFilters(prev => ({
                                  ...prev,
                                  supplier: checked 
                                    ? [...prev.supplier, supplier]
                                    : prev.supplier.filter(s => s !== supplier)
                                }))
                              }}
                            />
                            <span className="text-sm">{supplier}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Stock Range</label>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Min stock"
                          value={filters.minStock}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            minStock: parseInt(e.target.value) || 0
                          }))}
                        />
                        <Input
                          type="number"
                          placeholder="Max stock"
                          value={filters.maxStock}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            maxStock: parseInt(e.target.value) || 1000
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">
                      {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleBulkAction('restock')}>
                        <Package className="w-4 h-4 mr-1" />
                        Restock
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction('adjust')}>
                        <Edit className="w-4 h-4 mr-1" />
                        Adjust Stock
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedItems([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inventory Table/Cards */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Inventory Items ({filteredInventory.length})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-gray-200 rounded text-sm"
                  >
                    <option value="productName">Sort by Name</option>
                    <option value="currentStock">Sort by Stock</option>
                    <option value="category">Sort by Category</option>
                    <option value="supplier">Sort by Supplier</option>
                    <option value="lastRestocked">Sort by Last Restocked</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">
                          <Checkbox
                            checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="text-left p-3 font-medium">Product</th>
                        <th className="text-left p-3 font-medium">SKU</th>
                        <th className="text-left p-3 font-medium">Stock</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Category</th>
                        <th className="text-left p-3 font-medium">Supplier</th>
                        <th className="text-left p-3 font-medium">Last Restocked</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventory.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleSelectItem(item.id)}
                            />
                          </td>
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-sm text-gray-500">{item.location}</div>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {item.sku}
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div className="font-medium">{item.currentStock}</div>
                              <div className="text-gray-500">
                                Min: {item.minStockLevel} | Max: {item.maxStockLevel}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(item.status)}
                              <Badge className={getStatusColor(item.status)}>
                                {item.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-3 text-sm">
                            {item.category}
                          </td>
                          <td className="p-3 text-sm">
                            {item.supplier}
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {getTimeAgo(item.lastRestocked)}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInventory.map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-sm text-gray-500">{item.sku}</div>
                            </div>
                          </div>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleSelectItem(item.id)}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                            <div className="text-sm text-gray-500">
                              {item.category}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Current Stock</div>
                              <div className="font-medium text-lg">{item.currentStock}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Available</div>
                              <div className="font-medium text-lg">{item.availableStock}</div>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            Min: {item.minStockLevel} | Max: {item.maxStockLevel}
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            Last restocked: {getTimeAgo(item.lastRestocked)}
                          </div>
                          
                          <div className="flex items-center space-x-2 pt-2">
                            <Button variant="ghost" size="sm" className="flex-1">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'alerts' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${
                  alert.isRead ? 'bg-gray-50' : 'bg-white'
                } ${alert.severity === 'critical' ? 'border-red-200' : 
                   alert.severity === 'high' ? 'border-orange-200' : 
                   alert.severity === 'medium' ? 'border-yellow-200' : 'border-blue-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {alert.severity === 'critical' ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : alert.severity === 'high' ? (
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                      ) : alert.severity === 'medium' ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Bell className="w-5 h-5 text-blue-500" />
                      )}
                      <div>
                        <div className="font-medium">{alert.productName}</div>
                        <div className="text-sm text-gray-600">{alert.message}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {getTimeAgo(alert.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'reports' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Inventory Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Inventory reports coming soon</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
