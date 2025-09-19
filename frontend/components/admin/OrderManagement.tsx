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
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Calendar,
  User,
  DollarSign
} from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    image?: string
  }>
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  totals: {
    subtotal: number
    tax: number
    shipping: number
    total: number
  }
  paymentMethod: string
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface OrderFilters {
  status: string[]
  paymentStatus: string[]
  dateRange: [string, string]
  search: string
  minAmount: number
  maxAmount: number
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<OrderFilters>({
    status: [],
    paymentStatus: [],
    dateRange: ['', ''],
    search: '',
    minAmount: 0,
    maxAmount: 10000
  })
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customer: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567'
        },
        items: [
          { id: '1', name: 'Women\'s FlexFit Gym Leggings', quantity: 2, price: 49.99 },
          { id: '2', name: 'Sports Bra High Support', quantity: 1, price: 29.99 }
        ],
        status: 'delivered',
        paymentStatus: 'paid',
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        billingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        totals: {
          subtotal: 129.97,
          tax: 10.40,
          shipping: 9.99,
          total: 150.36
        },
        paymentMethod: 'Credit Card',
        trackingNumber: 'TRK123456789',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-18T14:20:00Z'
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        customer: {
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          phone: '+1 (555) 987-6543'
        },
        items: [
          { id: '3', name: 'Men\'s Performance Shorts', quantity: 1, price: 39.99 },
          { id: '4', name: 'Running Shoes Lightweight', quantity: 1, price: 89.99 }
        ],
        status: 'shipped',
        paymentStatus: 'paid',
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        billingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        totals: {
          subtotal: 129.98,
          tax: 10.40,
          shipping: 9.99,
          total: 150.37
        },
        paymentMethod: 'PayPal',
        trackingNumber: 'TRK987654321',
        createdAt: '2024-01-16T09:15:00Z',
        updatedAt: '2024-01-19T11:45:00Z'
      },
      {
        id: '3',
        orderNumber: 'ORD-003',
        customer: {
          name: 'Emma Wilson',
          email: 'emma.wilson@email.com',
          phone: '+1 (555) 456-7890'
        },
        items: [
          { id: '5', name: 'Yoga Mat Pro', quantity: 1, price: 49.99 }
        ],
        status: 'processing',
        paymentStatus: 'paid',
        shippingAddress: {
          street: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        billingAddress: {
          street: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        totals: {
          subtotal: 49.99,
          tax: 4.00,
          shipping: 9.99,
          total: 63.98
        },
        paymentMethod: 'Credit Card',
        createdAt: '2024-01-17T14:20:00Z',
        updatedAt: '2024-01-17T14:20:00Z'
      },
      {
        id: '4',
        orderNumber: 'ORD-004',
        customer: {
          name: 'David Brown',
          email: 'david.brown@email.com',
          phone: '+1 (555) 321-0987'
        },
        items: [
          { id: '6', name: 'Workout Gloves', quantity: 2, price: 19.99 },
          { id: '7', name: 'Protein Shaker', quantity: 1, price: 12.99 }
        ],
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress: {
          street: '321 Elm St',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA'
        },
        billingAddress: {
          street: '321 Elm St',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA'
        },
        totals: {
          subtotal: 52.97,
          tax: 4.24,
          shipping: 9.99,
          total: 67.20
        },
        paymentMethod: 'Credit Card',
        createdAt: '2024-01-18T16:45:00Z',
        updatedAt: '2024-01-18T16:45:00Z'
      },
      {
        id: '5',
        orderNumber: 'ORD-005',
        customer: {
          name: 'Lisa Garcia',
          email: 'lisa.garcia@email.com',
          phone: '+1 (555) 654-3210'
        },
        items: [
          { id: '8', name: 'Resistance Bands Set', quantity: 1, price: 24.99 }
        ],
        status: 'cancelled',
        paymentStatus: 'refunded',
        shippingAddress: {
          street: '654 Maple Dr',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          country: 'USA'
        },
        billingAddress: {
          street: '654 Maple Dr',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          country: 'USA'
        },
        totals: {
          subtotal: 24.99,
          tax: 2.00,
          shipping: 9.99,
          total: 36.98
        },
        paymentMethod: 'Credit Card',
        createdAt: '2024-01-14T12:30:00Z',
        updatedAt: '2024-01-16T09:15:00Z'
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    // Search filter
    if (filters.search && !order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) &&
        !order.customer.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !order.customer.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(order.status)) {
      return false
    }
    
    // Payment status filter
    if (filters.paymentStatus.length > 0 && !filters.paymentStatus.includes(order.paymentStatus)) {
      return false
    }
    
    // Amount range filter
    if (order.totals.total < filters.minAmount || order.totals.total > filters.maxAmount) {
      return false
    }
    
    return true
  }).sort((a, b) => {
    let aValue = a[sortBy as keyof Order]
    let bValue = b[sortBy as keyof Order]
    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue as string).getTime()
      bValue = new Date(bValue as string).getTime()
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) return
    
    try {
      console.log(`Bulk ${action} for orders:`, selectedOrders)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSelectedOrders([])
      alert(`Successfully ${action}ed ${selectedOrders.length} orders`)
    } catch (error) {
      console.error(`Bulk ${action} error:`, error)
      alert(`Failed to ${action} orders`)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
          : order
      ))
    } catch (error) {
      console.error('Status change error:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />
      case 'processing': return <Package className="w-4 h-4 text-yellow-500" />
      case 'pending': return <Clock className="w-4 h-4 text-gray-500" />
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />
      case 'refunded': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-orange-100 text-orange-800'
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading orders...</p>
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
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-gray-600">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
          <Button>
            <Package className="w-4 h-4 mr-2" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters & Search</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders, customers, or order numbers..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">Order Status</label>
                  <div className="space-y-2">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(status => (
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
                        <span className="text-sm capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Payment Status</label>
                  <div className="space-y-2">
                    {['pending', 'paid', 'failed', 'refunded'].map(status => (
                      <label key={status} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.paymentStatus.includes(status)}
                          onCheckedChange={(checked) => {
                            setFilters(prev => ({
                              ...prev,
                              paymentStatus: checked 
                                ? [...prev.paymentStatus, status]
                                : prev.paymentStatus.filter(s => s !== status)
                            }))
                          }}
                        />
                        <span className="text-sm capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Amount Range</label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Min amount"
                      value={filters.minAmount}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        minAmount: parseInt(e.target.value) || 0
                      }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max amount"
                      value={filters.maxAmount}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        maxAmount: parseInt(e.target.value) || 10000
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={filters.dateRange[0]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: [e.target.value, prev.dateRange[1]]
                      }))}
                    />
                    <Input
                      type="date"
                      value={filters.dateRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: [prev.dateRange[0], e.target.value]
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
      {selectedOrders.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleBulkAction('process')}>
                    <Package className="w-4 h-4 mr-1" />
                    Process
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('ship')}>
                    <Truck className="w-4 h-4 mr-1" />
                    Ship
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('cancel')}>
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedOrders([])}
              >
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Orders ({filteredOrders.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-200 rounded text-sm"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="orderNumber">Sort by Order Number</option>
                <option value="customer.name">Sort by Customer</option>
                <option value="totals.total">Sort by Amount</option>
                <option value="status">Sort by Status</option>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <Checkbox
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-3 font-medium">Order</th>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Items</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Payment</th>
                  <th className="text-left p-3 font-medium">Total</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">#{order.id}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        <div className="text-gray-500">
                          {order.items[0]?.name}
                          {order.items.length > 1 && ` +${order.items.length - 1} more`}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={
                        order.paymentStatus === 'paid' ? 'default' :
                        order.paymentStatus === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-3 font-medium">
                      {formatCurrency(order.totals.total)}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {formatDate(order.createdAt)}
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
        </CardContent>
      </Card>
    </div>
  )
}
