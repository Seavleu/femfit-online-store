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
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingCart,
  Star,
  Users,
  UserPlus,
  MoreHorizontal,
  TrendingUp,
  Clock
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  status: 'active' | 'inactive' | 'banned'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: string
  registrationDate: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  preferences: {
    newsletter: boolean
    sms: boolean
    marketing: boolean
  }
  tags: string[]
  notes?: string
}

interface CustomerFilters {
  status: string[]
  tier: string[]
  tags: string[]
  search: string
  minSpent: number
  maxSpent: number
  dateRange: [string, string]
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<CustomerFilters>({
    status: [],
    tier: [],
    tags: [],
    search: '',
    minSpent: 0,
    maxSpent: 10000,
    dateRange: ['', '']
  })
  const [sortBy, setSortBy] = useState('totalSpent')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        status: 'active',
        tier: 'gold',
        totalOrders: 15,
        totalSpent: 1250.50,
        averageOrderValue: 83.37,
        lastOrderDate: '2024-01-15T10:30:00Z',
        registrationDate: '2023-06-15T09:00:00Z',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        preferences: {
          newsletter: true,
          sms: false,
          marketing: true
        },
        tags: ['VIP', 'Frequent Buyer', 'Fitness Enthusiast'],
        notes: 'Prefers eco-friendly products'
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1 (555) 987-6543',
        status: 'active',
        tier: 'silver',
        totalOrders: 8,
        totalSpent: 650.25,
        averageOrderValue: 81.28,
        lastOrderDate: '2024-01-16T14:20:00Z',
        registrationDate: '2023-08-20T11:30:00Z',
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        preferences: {
          newsletter: true,
          sms: true,
          marketing: false
        },
        tags: ['New Customer', 'Tech Savvy'],
        notes: 'Interested in smart fitness gear'
      },
      {
        id: '3',
        name: 'Emma Wilson',
        email: 'emma.wilson@email.com',
        phone: '+1 (555) 456-7890',
        status: 'active',
        tier: 'platinum',
        totalOrders: 32,
        totalSpent: 2850.75,
        averageOrderValue: 89.09,
        lastOrderDate: '2024-01-17T16:45:00Z',
        registrationDate: '2023-03-10T08:15:00Z',
        address: {
          street: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        preferences: {
          newsletter: true,
          sms: true,
          marketing: true
        },
        tags: ['VIP', 'Brand Ambassador', 'Yoga Instructor'],
        notes: 'Influencer with 50K followers'
      },
      {
        id: '4',
        name: 'David Brown',
        email: 'david.brown@email.com',
        phone: '+1 (555) 321-0987',
        status: 'inactive',
        tier: 'bronze',
        totalOrders: 3,
        totalSpent: 150.00,
        averageOrderValue: 50.00,
        lastOrderDate: '2023-11-20T12:00:00Z',
        registrationDate: '2023-10-15T14:30:00Z',
        address: {
          street: '321 Elm St',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA'
        },
        preferences: {
          newsletter: false,
          sms: false,
          marketing: false
        },
        tags: ['Price Sensitive'],
        notes: 'Only buys during sales'
      },
      {
        id: '5',
        name: 'Lisa Garcia',
        email: 'lisa.garcia@email.com',
        phone: '+1 (555) 654-3210',
        status: 'active',
        tier: 'silver',
        totalOrders: 12,
        totalSpent: 980.50,
        averageOrderValue: 81.71,
        lastOrderDate: '2024-01-18T09:15:00Z',
        registrationDate: '2023-07-05T16:20:00Z',
        address: {
          street: '654 Maple Dr',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          country: 'USA'
        },
        preferences: {
          newsletter: true,
          sms: false,
          marketing: true
        },
        tags: ['Fitness Enthusiast', 'Early Adopter'],
        notes: 'Loves trying new products first'
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setCustomers(mockCustomers)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and sort customers
  const filteredCustomers = customers.filter(customer => {
    // Search filter
    if (filters.search && !customer.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !customer.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(customer.status)) {
      return false
    }
    
    // Tier filter
    if (filters.tier.length > 0 && !filters.tier.includes(customer.tier)) {
      return false
    }
    
    // Tags filter
    if (filters.tags.length > 0 && !filters.tags.some(tag => customer.tags.includes(tag))) {
      return false
    }
    
    // Spent range filter
    if (customer.totalSpent < filters.minSpent || customer.totalSpent > filters.maxSpent) {
      return false
    }
    
    return true
  }).sort((a, b) => {
    let aValue = a[sortBy as keyof Customer]
    let bValue = b[sortBy as keyof Customer]
    
    if (sortBy === 'registrationDate' || sortBy === 'lastOrderDate') {
      aValue = new Date(aValue as string).getTime()
      bValue = new Date(bValue as string).getTime()
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedCustomers.length === 0) return
    
    try {
      console.log(`Bulk ${action} for customers:`, selectedCustomers)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSelectedCustomers([])
      alert(`Successfully ${action}ed ${selectedCustomers.length} customers`)
    } catch (error) {
      console.error(`Bulk ${action} error:`, error)
      alert(`Failed to ${action} customers`)
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-800'
      case 'gold': return 'bg-yellow-100 text-yellow-800'
      case 'silver': return 'bg-gray-100 text-gray-800'
      case 'bronze': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'banned': return 'bg-red-100 text-red-800'
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
      day: 'numeric'
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
            <p className="mt-2">Loading customers...</p>
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
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-gray-600">Manage customer relationships and segmentation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Customers
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold">{customers.filter(c => c.status === 'active').length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">VIP Customers</p>
                <p className="text-2xl font-bold">{customers.filter(c => c.tier === 'platinum' || c.tier === 'gold').length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                placeholder="Search customers by name or email..."
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
                    {['active', 'inactive', 'banned'].map(status => (
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
                  <label className="text-sm font-medium mb-2 block">Tier</label>
                  <div className="space-y-2">
                    {['bronze', 'silver', 'gold', 'platinum'].map(tier => (
                      <label key={tier} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.tier.includes(tier)}
                          onCheckedChange={(checked) => {
                            setFilters(prev => ({
                              ...prev,
                              tier: checked 
                                ? [...prev.tier, tier]
                                : prev.tier.filter(t => t !== tier)
                            }))
                          }}
                        />
                        <span className="text-sm capitalize">{tier}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="space-y-2">
                    {['VIP', 'Frequent Buyer', 'Fitness Enthusiast', 'New Customer', 'Brand Ambassador'].map(tag => (
                      <label key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.tags.includes(tag)}
                          onCheckedChange={(checked) => {
                            setFilters(prev => ({
                              ...prev,
                              tags: checked 
                                ? [...prev.tags, tag]
                                : prev.tags.filter(t => t !== tag)
                            }))
                          }}
                        />
                        <span className="text-sm">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Total Spent</label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Min amount"
                      value={filters.minSpent}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        minSpent: parseInt(e.target.value) || 0
                      }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max amount"
                      value={filters.maxSpent}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        maxSpent: parseInt(e.target.value) || 10000
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
      {selectedCustomers.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {selectedCustomers.length} customer{selectedCustomers.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleBulkAction('email')}>
                    <Mail className="w-4 h-4 mr-1" />
                    Send Email
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('tag')}>
                    <Star className="w-4 h-4 mr-1" />
                    Add Tag
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
                onClick={() => setSelectedCustomers([])}
              >
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers Table/Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Customers ({filteredCustomers.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-200 rounded text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="totalSpent">Sort by Total Spent</option>
                <option value="totalOrders">Sort by Orders</option>
                <option value="registrationDate">Sort by Registration</option>
                <option value="lastOrderDate">Sort by Last Order</option>
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
                        checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-3 font-medium">Customer</th>
                    <th className="text-left p-3 font-medium">Tier</th>
                    <th className="text-left p-3 font-medium">Orders</th>
                    <th className="text-left p-3 font-medium">Total Spent</th>
                    <th className="text-left p-3 font-medium">Last Order</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedCustomers.includes(customer.id)}
                          onCheckedChange={() => handleSelectCustomer(customer.id)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getTierColor(customer.tier)}>
                          {customer.tier}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          {customer.totalOrders} orders
                          <div className="text-gray-500">
                            Avg: {formatCurrency(customer.averageOrderValue)}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-medium">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {customer.lastOrderDate ? getTimeAgo(customer.lastOrderDate) : 'Never'}
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
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
                            <Mail className="w-4 h-4" />
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
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={() => handleSelectCustomer(customer.id)}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getTierColor(customer.tier)}>
                          {customer.tier}
                        </Badge>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Orders</div>
                          <div className="font-medium">{customer.totalOrders}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Total Spent</div>
                          <div className="font-medium">{formatCurrency(customer.totalSpent)}</div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Last order: {customer.lastOrderDate ? getTimeAgo(customer.lastOrderDate) : 'Never'}
                      </div>
                      
                      {customer.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {customer.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {customer.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{customer.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                      
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
    </div>
  )
}
