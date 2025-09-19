'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Eye,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    total: number
    change: number
    period: string
  }
  orders: {
    total: number
    change: number
    pending: number
    completed: number
  }
  customers: {
    total: number
    change: number
    new: number
    returning: number
  }
  products: {
    total: number
    change: number
    lowStock: number
    outOfStock: number
  }
  views: {
    total: number
    change: number
    unique: number
  }
}

interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
  change: number
}

interface RecentOrder {
  id: string
  customer: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      // Simulate API call - in production, this would fetch real data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data based on time range
      const mockData: AnalyticsData = {
        revenue: {
          total: timeRange === '7d' ? 12500 : timeRange === '30d' ? 45000 : timeRange === '90d' ? 125000 : 450000,
          change: timeRange === '7d' ? 12.5 : timeRange === '30d' ? 8.2 : timeRange === '90d' ? 15.3 : 22.1,
          period: timeRange
        },
        orders: {
          total: timeRange === '7d' ? 45 : timeRange === '30d' ? 180 : timeRange === '90d' ? 520 : 2100,
          change: timeRange === '7d' ? 5.2 : timeRange === '30d' ? 12.8 : timeRange === '90d' ? 18.5 : 25.3,
          pending: 8,
          completed: timeRange === '7d' ? 37 : timeRange === '30d' ? 155 : timeRange === '90d' ? 445 : 1850
        },
        customers: {
          total: timeRange === '7d' ? 25 : timeRange === '30d' ? 95 : timeRange === '90d' ? 280 : 1200,
          change: timeRange === '7d' ? 8.1 : timeRange === '30d' ? 15.6 : timeRange === '90d' ? 22.3 : 28.7,
          new: timeRange === '7d' ? 15 : timeRange === '30d' ? 45 : timeRange === '90d' ? 120 : 480,
          returning: timeRange === '7d' ? 10 : timeRange === '30d' ? 50 : timeRange === '90d' ? 160 : 720
        },
        products: {
          total: 156,
          change: 2.1,
          lowStock: 8,
          outOfStock: 3
        },
        views: {
          total: timeRange === '7d' ? 1250 : timeRange === '30d' ? 5200 : timeRange === '90d' ? 15800 : 65000,
          change: timeRange === '7d' ? 3.2 : timeRange === '30d' ? 9.8 : timeRange === '90d' ? 16.4 : 24.1,
          unique: timeRange === '7d' ? 890 : timeRange === '30d' ? 3200 : timeRange === '90d' ? 9800 : 42000
        }
      }

      const mockTopProducts: TopProduct[] = [
        { id: '1', name: 'Women\'s FlexFit Gym Leggings', sales: 45, revenue: 2250, change: 12.5 },
        { id: '2', name: 'Men\'s Performance Shorts', sales: 38, revenue: 1900, change: 8.3 },
        { id: '3', name: 'Yoga Mat Pro', sales: 32, revenue: 1600, change: 15.7 },
        { id: '4', name: 'Sports Bra High Support', sales: 28, revenue: 1400, change: 6.2 },
        { id: '5', name: 'Running Shoes Lightweight', sales: 25, revenue: 2500, change: 18.9 }
      ]

      const mockRecentOrders: RecentOrder[] = [
        { id: 'ORD-001', customer: 'Sarah Johnson', amount: 89.99, status: 'delivered', date: '2024-01-19' },
        { id: 'ORD-002', customer: 'Mike Chen', amount: 156.50, status: 'shipped', date: '2024-01-19' },
        { id: 'ORD-003', customer: 'Emma Wilson', amount: 67.25, status: 'processing', date: '2024-01-18' },
        { id: 'ORD-004', customer: 'David Brown', amount: 234.75, status: 'pending', date: '2024-01-18' },
        { id: 'ORD-005', customer: 'Lisa Garcia', amount: 98.00, status: 'delivered', date: '2024-01-17' }
      ]

      setAnalytics(mockData)
      setTopProducts(mockTopProducts)
      setRecentOrders(mockRecentOrders)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data</p>
        <Button onClick={fetchAnalytics} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Real-time insights into your store performance</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.revenue.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.revenue.change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.revenue.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(analytics.revenue.change)}%
              </span>
              <span className="ml-1">from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.orders.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.orders.change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.orders.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(analytics.orders.change)}%
              </span>
              <span className="ml-1">from last {timeRange}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics.orders.pending} pending, {analytics.orders.completed} completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.customers.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.customers.change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.customers.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(analytics.customers.change)}%
              </span>
              <span className="ml-1">from last {timeRange}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics.customers.new} new, {analytics.customers.returning} returning
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.products.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.products.change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.products.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(analytics.products.change)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics.products.lowStock} low stock, {analytics.products.outOfStock} out of stock
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.views.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.views.change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.views.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(analytics.views.change)}%
              </span>
              <span className="ml-1">from last {timeRange}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatNumber(analytics.views.unique)} unique visitors
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">0.3%</span>
              <span className="ml-1">from last {timeRange}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics.orders.total} orders from {analytics.views.unique} visitors
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(product.revenue)}</p>
                    <div className="flex items-center text-xs">
                      {product.change > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={product.change > 0 ? 'text-green-500' : 'text-red-500'}>
                        {Math.abs(product.change)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.id} • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(order.amount)}</p>
                    <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
