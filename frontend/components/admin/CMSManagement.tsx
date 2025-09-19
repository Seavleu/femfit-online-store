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
  Plus,
  FileText,
  Image,
  Home,
  Settings,
  Globe,
  Calendar,
  User,
  Tag,
  MoreHorizontal,
  ExternalLink,
  RefreshCw,
  Trash2,
  Copy,
  Upload
} from 'lucide-react'
import Link from 'next/link'

interface ContentItem {
  id: string
  title: string
  slug: string
  type: 'product' | 'category' | 'page' | 'blog' | 'banner' | 'homepage' | 'settings' | 'footer'
  status: 'published' | 'draft' | 'archived'
  author: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  featuredImage?: string
  excerpt?: string
  tags?: string[]
  views?: number
  seo?: {
    title: string
    description: string
    keywords: string
  }
}

interface ContentFilters {
  type: string[]
  status: string[]
  author: string[]
  search: string
  dateRange: [string, string]
  tags: string[]
}

export default function CMSManagement() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ContentFilters>({
    type: [],
    status: [],
    author: [],
    search: '',
    dateRange: ['', ''],
    tags: []
  })
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'pages' | 'blog' | 'media'>('all')

  // Mock data - in production, this would come from Strapi API
  useEffect(() => {
    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'Women\'s FlexFit Gym Leggings',
        slug: 'womens-flexfit-gym-leggings',
        type: 'product',
        status: 'published',
        author: 'Admin User',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-19T14:30:00Z',
        publishedAt: '2024-01-10T10:00:00Z',
        featuredImage: '/images/products/leggings.jpg',
        excerpt: 'High-performance leggings designed for intense workouts',
        tags: ['activewear', 'leggings', 'women'],
        views: 1250,
        seo: {
          title: 'Women\'s FlexFit Gym Leggings - Premium Activewear',
          description: 'Shop our premium women\'s gym leggings designed for comfort and performance',
          keywords: 'leggings, activewear, gym, women, fitness'
        }
      },
      {
        id: '2',
        title: 'About Us',
        slug: 'about-us',
        type: 'page',
        status: 'published',
        author: 'Content Manager',
        createdAt: '2024-01-05T09:00:00Z',
        updatedAt: '2024-01-15T11:20:00Z',
        publishedAt: '2024-01-05T09:00:00Z',
        featuredImage: '/images/pages/about.jpg',
        excerpt: 'Learn about our mission to provide quality fitness gear',
        tags: ['company', 'mission', 'about'],
        views: 890,
        seo: {
          title: 'About FEMFIT - Your Fitness Partner',
          description: 'Discover our story and commitment to quality fitness gear',
          keywords: 'about, company, fitness, mission'
        }
      },
      {
        id: '3',
        title: '10 Tips for Better Workouts',
        slug: '10-tips-better-workouts',
        type: 'blog',
        status: 'published',
        author: 'Fitness Expert',
        createdAt: '2024-01-12T14:00:00Z',
        updatedAt: '2024-01-12T14:00:00Z',
        publishedAt: '2024-01-12T14:00:00Z',
        featuredImage: '/images/blog/workout-tips.jpg',
        excerpt: 'Discover proven strategies to maximize your workout effectiveness',
        tags: ['fitness', 'tips', 'workout', 'health'],
        views: 2100,
        seo: {
          title: '10 Expert Tips for Better Workouts | FEMFIT Blog',
          description: 'Get expert advice on improving your workout routine',
          keywords: 'workout tips, fitness, exercise, health'
        }
      },
      {
        id: '4',
        title: 'Summer Sale Banner',
        slug: 'summer-sale-banner',
        type: 'banner',
        status: 'published',
        author: 'Marketing Team',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z',
        publishedAt: '2024-01-15T08:00:00Z',
        featuredImage: '/images/banners/summer-sale.jpg',
        excerpt: 'Promotional banner for summer sale campaign',
        tags: ['promotion', 'sale', 'summer'],
        views: 0,
        seo: {
          title: 'Summer Sale - Up to 50% Off',
          description: 'Don\'t miss our biggest sale of the year',
          keywords: 'sale, summer, discount, promotion'
        }
      },
      {
        id: '5',
        title: 'Homepage Hero Section',
        slug: 'homepage-hero',
        type: 'homepage',
        status: 'published',
        author: 'Design Team',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-18T16:45:00Z',
        publishedAt: '2024-01-01T00:00:00Z',
        featuredImage: '/images/homepage/hero.jpg',
        excerpt: 'Main hero section for the homepage',
        tags: ['homepage', 'hero', 'main'],
        views: 15000,
        seo: {
          title: 'FEMFIT - Premium Fitness Gear',
          description: 'Shop the best fitness gear and activewear',
          keywords: 'fitness, gear, activewear, workout'
        }
      },
      {
        id: '6',
        title: 'Men\'s Performance Shorts',
        slug: 'mens-performance-shorts',
        type: 'product',
        status: 'draft',
        author: 'Product Manager',
        createdAt: '2024-01-18T10:30:00Z',
        updatedAt: '2024-01-19T09:15:00Z',
        featuredImage: '/images/products/shorts.jpg',
        excerpt: 'Lightweight shorts perfect for running and training',
        tags: ['activewear', 'shorts', 'men'],
        views: 0,
        seo: {
          title: 'Men\'s Performance Shorts - Lightweight Training',
          description: 'Shop our lightweight men\'s performance shorts',
          keywords: 'shorts, men, activewear, training'
        }
      },
      {
        id: '7',
        title: 'Contact Us',
        slug: 'contact-us',
        type: 'page',
        status: 'published',
        author: 'Content Manager',
        createdAt: '2024-01-03T11:00:00Z',
        updatedAt: '2024-01-10T14:20:00Z',
        publishedAt: '2024-01-03T11:00:00Z',
        featuredImage: '/images/pages/contact.jpg',
        excerpt: 'Get in touch with our team',
        tags: ['contact', 'support', 'help'],
        views: 650,
        seo: {
          title: 'Contact FEMFIT - Get Support',
          description: 'Contact our team for support and inquiries',
          keywords: 'contact, support, help, customer service'
        }
      },
      {
        id: '8',
        title: 'Site Settings',
        slug: 'site-settings',
        type: 'settings',
        status: 'published',
        author: 'Admin User',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-19T12:00:00Z',
        publishedAt: '2024-01-01T00:00:00Z',
        tags: ['settings', 'configuration'],
        views: 0,
        seo: {
          title: 'FEMFIT Settings',
          description: 'Site configuration and settings',
          keywords: 'settings, configuration'
        }
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setContent(mockContent)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and sort content
  const filteredContent = content.filter(item => {
    // Tab filter
    if (activeTab !== 'all') {
      const tabTypeMap = {
        'products': 'product',
        'pages': 'page',
        'blog': 'blog',
        'media': 'banner'
      }
      if (tabTypeMap[activeTab as keyof typeof tabTypeMap] !== item.type) {
        return false
      }
    }
    
    // Search filter
    if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !item.slug.toLowerCase().includes(filters.search.toLowerCase()) &&
        !item.excerpt?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    
    // Type filter
    if (filters.type.length > 0 && !filters.type.includes(item.type)) {
      return false
    }
    
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(item.status)) {
      return false
    }
    
    // Author filter
    if (filters.author.length > 0 && !filters.author.includes(item.author)) {
      return false
    }
    
    // Tags filter
    if (filters.tags.length > 0 && !filters.tags.some(tag => item.tags?.includes(tag))) {
      return false
    }
    
    return true
  }).sort((a, b) => {
    let aValue = a[sortBy as keyof ContentItem]
    let bValue = b[sortBy as keyof ContentItem]
    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'publishedAt') {
      aValue = new Date(aValue as string).getTime()
      bValue = new Date(bValue as string).getTime()
    }
    
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
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredContent.map(item => item.id))
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return <Tag className="w-4 h-4" />
      case 'page': return <FileText className="w-4 h-4" />
      case 'blog': return <Edit className="w-4 h-4" />
      case 'banner': return <Image className="w-4 h-4" />
      case 'homepage': return <Home className="w-4 h-4" />
      case 'settings': return <Settings className="w-4 h-4" />
      case 'footer': return <Globe className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'bg-blue-100 text-blue-800'
      case 'page': return 'bg-green-100 text-green-800'
      case 'blog': return 'bg-purple-100 text-purple-800'
      case 'banner': return 'bg-orange-100 text-orange-800'
      case 'homepage': return 'bg-pink-100 text-pink-800'
      case 'settings': return 'bg-gray-100 text-gray-800'
      case 'footer': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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

  const getStrapiEditUrl = (item: ContentItem) => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    
    switch (item.type) {
      case 'product':
        return `${baseUrl}/admin/content-manager/collection-types/api::product-content-type.product-content-type/${item.id}`
      case 'page':
        return `${baseUrl}/admin/content-manager/collection-types/api::page-content-type.page-content-type/${item.id}`
      case 'blog':
        return `${baseUrl}/admin/content-manager/collection-types/api::blog-post.blog-post/${item.id}`
      case 'banner':
        return `${baseUrl}/admin/content-manager/collection-types/api::banner-content-type.banner-content-type/${item.id}`
      case 'homepage':
        return `${baseUrl}/admin/content-manager/single-types/api::homepage.homepage`
      case 'settings':
        return `${baseUrl}/admin/content-manager/single-types/api::site-setting.site-setting`
      case 'footer':
        return `${baseUrl}/admin/content-manager/single-types/api::footer.footer`
      default:
        return `${baseUrl}/admin/content-manager`
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading content...</p>
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
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-gray-600">Manage your website content and media</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Content
          </Button>
          <Button asChild>
            <Link href="http://localhost:1337/admin" target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Strapi Admin
            </Link>
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-bold">{content.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {content.filter(item => item.status === 'published').length}
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
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {content.filter(item => item.status === 'draft').length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">
                  {content.reduce((sum, item) => sum + (item.views || 0), 0).toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-1 sm:space-x-8 min-w-max">
          {[
            { id: 'all', label: 'All Content', icon: FileText },
            { id: 'products', label: 'Products', icon: Tag },
            { id: 'pages', label: 'Pages', icon: FileText },
            { id: 'blog', label: 'Blog', icon: Edit },
            { id: 'media', label: 'Media', icon: Image }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-0 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-sm sm:text-base">{tab.label}</span>
            </button>
          ))}
        </nav>
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
                placeholder="Search content by title, slug, or excerpt..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <div className="space-y-2">
                    {['product', 'page', 'blog', 'banner', 'homepage', 'settings', 'footer'].map(type => (
                      <label key={type} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.type.includes(type)}
                          onCheckedChange={(checked) => {
                            setFilters(prev => ({
                              ...prev,
                              type: checked 
                                ? [...prev.type, type]
                                : prev.type.filter(t => t !== type)
                            }))
                          }}
                        />
                        <span className="text-sm capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <div className="space-y-2">
                    {['published', 'draft', 'archived'].map(status => (
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
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <div className="space-y-2">
                    {['Admin User', 'Content Manager', 'Product Manager', 'Marketing Team', 'Design Team', 'Fitness Expert'].map(author => (
                      <label key={author} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.author.includes(author)}
                          onCheckedChange={(checked) => {
                            setFilters(prev => ({
                              ...prev,
                              author: checked 
                                ? [...prev.author, author]
                                : prev.author.filter(a => a !== author)
                            }))
                          }}
                        />
                        <span className="text-sm">{author}</span>
                      </label>
                    ))}
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
      {selectedItems.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleBulkAction('publish')}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Publish
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('draft')}>
                    <Edit className="w-4 h-4 mr-1" />
                    Draft
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('duplicate')}>
                    <Copy className="w-4 h-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
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

      {/* Content Table/Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Content Items ({filteredContent.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-200 rounded text-sm"
              >
                <option value="title">Sort by Title</option>
                <option value="updatedAt">Sort by Updated</option>
                <option value="createdAt">Sort by Created</option>
                <option value="status">Sort by Status</option>
                <option value="type">Sort by Type</option>
                <option value="views">Sort by Views</option>
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
                        checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-3 font-medium">Content</th>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Author</th>
                    <th className="text-left p-3 font-medium">Updated</th>
                    <th className="text-left p-3 font-medium">Views</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContent.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center">
                            {item.featuredImage ? (
                              <img 
                                src={item.featuredImage} 
                                alt={item.title}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              getTypeIcon(item.type)
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.slug}</div>
                            {item.excerpt && (
                              <div className="text-xs text-gray-400 mt-1">
                                {item.excerpt.substring(0, 60)}...
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm">
                        {item.author}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {getTimeAgo(item.updatedAt)}
                      </td>
                      <td className="p-3 text-sm">
                        {item.views?.toLocaleString() || 0}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/shop/${item.slug}`} target="_blank">
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={getStrapiEditUrl(item)} target="_blank">
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
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
              {filteredContent.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                          {item.featuredImage ? (
                            <img 
                              src={item.featuredImage} 
                              alt={item.title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            getTypeIcon(item.type)
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-500">{item.slug}</div>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      
                      {item.excerpt && (
                        <div className="text-sm text-gray-600">
                          {item.excerpt.substring(0, 100)}...
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Author</div>
                          <div className="font-medium">{item.author}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Views</div>
                          <div className="font-medium">{item.views?.toLocaleString() || 0}</div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Updated: {getTimeAgo(item.updatedAt)}
                      </div>
                      
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <Button variant="ghost" size="sm" className="flex-1" asChild>
                          <Link href={`/shop/${item.slug}`} target="_blank">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1" asChild>
                          <Link href={getStrapiEditUrl(item)} target="_blank">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
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