'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  Filter,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  RefreshCw,
  Settings,
  FileText,
  Mail,
  Star
} from 'lucide-react'

interface ReportData {
  id: string
  name: string
  type: 'sales' | 'customers' | 'products' | 'inventory' | 'marketing' | 'financial'
  description: string
  lastGenerated: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  isScheduled: boolean
  format: 'pdf' | 'excel' | 'csv'
  size: string
  status: 'ready' | 'generating' | 'error'
}

interface AnalyticsData {
  period: string
  revenue: {
    total: number
    change: number
    growth: number
  }
  orders: {
    total: number
    change: number
    averageValue: number
  }
  customers: {
    total: number
    new: number
    returning: number
    retention: number
  }
  products: {
    total: number
    topSelling: Array<{
      name: string
      sales: number
      revenue: number
    }>
    lowStock: number
  }
  marketing: {
    emailOpenRate: number
    clickThroughRate: number
    conversionRate: number
    socialEngagement: number
  }
}

export default function ReportingAnalytics() {
  const [reports, setReports] = useState<ReportData[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'analytics' | 'exports'>('overview')
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d')
  const [customDateRange, setCustomDateRange] = useState<[string, string]>(['', ''])
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockReports: ReportData[] = [
      {
        id: '1',
        name: 'Sales Performance Report',
        type: 'sales',
        description: 'Comprehensive sales analysis with revenue trends and performance metrics',
        lastGenerated: '2024-01-19T10:00:00Z',
        frequency: 'weekly',
        isScheduled: true,
        format: 'pdf',
        size: '2.3 MB',
        status: 'ready'
      },
      {
        id: '2',
        name: 'Customer Analytics Dashboard',
        type: 'customers',
        description: 'Customer behavior analysis, segmentation, and lifetime value metrics',
        lastGenerated: '2024-01-18T14:30:00Z',
        frequency: 'monthly',
        isScheduled: true,
        format: 'excel',
        size: '5.7 MB',
        status: 'ready'
      },
      {
        id: '3',
        name: 'Product Performance Report',
        type: 'products',
        description: 'Product sales analysis, inventory turnover, and profitability metrics',
        lastGenerated: '2024-01-17T09:15:00Z',
        frequency: 'weekly',
        isScheduled: true,
        format: 'csv',
        size: '1.8 MB',
        status: 'ready'
      },
      {
        id: '4',
        name: 'Inventory Status Report',
        type: 'inventory',
        description: 'Current inventory levels, stock movements, and reorder recommendations',
        lastGenerated: '2024-01-19T08:45:00Z',
        frequency: 'daily',
        isScheduled: true,
        format: 'pdf',
        size: '3.1 MB',
        status: 'ready'
      },
      {
        id: '5',
        name: 'Marketing Campaign Analysis',
        type: 'marketing',
        description: 'Email campaigns, social media performance, and conversion tracking',
        lastGenerated: '2024-01-16T16:20:00Z',
        frequency: 'weekly',
        isScheduled: true,
        format: 'excel',
        size: '4.2 MB',
        status: 'ready'
      },
      {
        id: '6',
        name: 'Financial Summary Report',
        type: 'financial',
        description: 'Revenue, expenses, profit margins, and financial health metrics',
        lastGenerated: '2024-01-15T11:00:00Z',
        frequency: 'monthly',
        isScheduled: true,
        format: 'pdf',
        size: '6.5 MB',
        status: 'generating'
      }
    ]

    const mockAnalytics: AnalyticsData = {
      period: '30d',
      revenue: {
        total: 125000,
        change: 12.5,
        growth: 8.3
      },
      orders: {
        total: 1250,
        change: 15.2,
        averageValue: 100.00
      },
      customers: {
        total: 850,
        new: 125,
        returning: 725,
        retention: 85.3
      },
      products: {
        total: 156,
        topSelling: [
          { name: 'Women\'s FlexFit Gym Leggings', sales: 45, revenue: 2250 },
          { name: 'Men\'s Performance Shorts', sales: 38, revenue: 1520 },
          { name: 'Yoga Mat Pro', sales: 32, revenue: 1600 },
          { name: 'Sports Bra High Support', sales: 28, revenue: 840 },
          { name: 'Running Shoes Lightweight', sales: 25, revenue: 2250 }
        ],
        lowStock: 8
      },
      marketing: {
        emailOpenRate: 24.5,
        clickThroughRate: 3.2,
        conversionRate: 2.8,
        socialEngagement: 12.3
      }
    }

    // Simulate API call
    setTimeout(() => {
      setReports(mockReports)
      setAnalytics(mockAnalytics)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleGenerateReport = async (reportId: string) => {
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Report generated successfully!')
    } catch (error) {
      console.error('Report generation error:', error)
      alert('Failed to generate report')
    }
  }

  const handleBulkExport = async () => {
    if (selectedReports.length === 0) return
    
    try {
      // Simulate bulk export
      await new Promise(resolve => setTimeout(resolve, 3000))
      alert(`Successfully exported ${selectedReports.length} reports`)
      setSelectedReports([])
    } catch (error) {
      console.error('Bulk export error:', error)
      alert('Failed to export reports')
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales': return <DollarSign className="w-4 h-4" />
      case 'customers': return <Users className="w-4 h-4" />
      case 'products': return <Package className="w-4 h-4" />
      case 'inventory': return <Package className="w-4 h-4" />
      case 'marketing': return <Mail className="w-4 h-4" />
      case 'financial': return <BarChart3 className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales': return 'bg-green-100 text-green-800'
      case 'customers': return 'bg-blue-100 text-blue-800'
      case 'products': return 'bg-purple-100 text-purple-800'
      case 'inventory': return 'bg-orange-100 text-orange-800'
      case 'marketing': return 'bg-pink-100 text-pink-800'
      case 'financial': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800'
      case 'generating': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading reports and analytics...</p>
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
          <h2 className="text-2xl font-bold">Reporting & Analytics</h2>
          <p className="text-gray-600">Comprehensive business intelligence and reporting</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Time Period:</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="custom">Custom range</option>
              </select>
              {dateRange === 'custom' && (
                <div className="flex items-center space-x-2">
                  <Input
                    type="date"
                    value={customDateRange[0]}
                    onChange={(e) => setCustomDateRange([e.target.value, customDateRange[1]])}
                    className="text-sm"
                  />
                  <span>to</span>
                  <Input
                    type="date"
                    value={customDateRange[1]}
                    onChange={(e) => setCustomDateRange([customDateRange[0], e.target.value])}
                    className="text-sm"
                  />
                </div>
              )}
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: PieChart },
            { id: 'exports', label: 'Exports', icon: Download }
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
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && analytics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(analytics.revenue.total)}</p>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {analytics.revenue.change}% from last period
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold">{formatNumber(analytics.orders.total)}</p>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {analytics.orders.change}% from last period
                    </div>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold">{formatNumber(analytics.customers.total)}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {analytics.customers.new} new, {analytics.customers.returning} returning
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(analytics.orders.averageValue)}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Per order
                    </div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Top Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.products.topSelling.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sales} sales</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(product.revenue)}</div>
                      <div className="text-sm text-gray-500">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Marketing Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Email Open Rate</p>
                  <p className="text-2xl font-bold">{analytics.marketing.emailOpenRate}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Click Through Rate</p>
                  <p className="text-2xl font-bold">{analytics.marketing.clickThroughRate}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold">{analytics.marketing.conversionRate}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Social Engagement</p>
                  <p className="text-2xl font-bold">{analytics.marketing.socialEngagement}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Reports List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <Badge className={getTypeColor(report.type)}>
                          {report.type}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex justify-between">
                      <span>Last Generated:</span>
                      <span>{formatDate(report.lastGenerated)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span className="capitalize">{report.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="uppercase">{report.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={report.status === 'generating'}
                    >
                      {report.status === 'generating' ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      {report.status === 'generating' ? 'Generating...' : 'Generate'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Advanced analytics charts coming soon</p>
                <p className="text-sm text-gray-400 mt-2">
                  Interactive charts, trend analysis, and predictive analytics will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'exports' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Export management coming soon</p>
                <p className="text-sm text-gray-400 mt-2">
                  Manage scheduled exports, download history, and export settings
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
