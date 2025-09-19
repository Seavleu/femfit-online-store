'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function SimpleCMSTest() {
  const [testResults, setTestResults] = useState({
    strapiConnection: 'loading',
    products: 'loading',
    categories: 'loading'
  })

  const [data, setData] = useState({
    products: [],
    categories: []
  })

  useEffect(() => {
    testStrapiConnection()
  }, [])

  const testStrapiConnection = async () => {
    try {
      // Test basic connection
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/product-content-types?pagination[pageSize]=1`)
      if (response.ok) {
        setTestResults(prev => ({ ...prev, strapiConnection: 'success' }))
        
        // Test products
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/product-content-types?pagination[pageSize]=3`)
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setData(prev => ({ ...prev, products: productsData.data || [] }))
          setTestResults(prev => ({ ...prev, products: 'success' }))
        } else {
          setTestResults(prev => ({ ...prev, products: 'error' }))
        }

        // Test categories
        const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/category-content-types?pagination[pageSize]=3`)
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setData(prev => ({ ...prev, categories: categoriesData.data || [] }))
          setTestResults(prev => ({ ...prev, categories: 'success' }))
        } else {
          setTestResults(prev => ({ ...prev, categories: 'error' }))
        }
      } else {
        setTestResults(prev => ({ ...prev, strapiConnection: 'error' }))
      }
    } catch (error) {
      console.error('Connection test failed:', error)
      setTestResults(prev => ({ ...prev, strapiConnection: 'error' }))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading': return <Loader2 className="w-4 h-4 animate-spin" />
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <XCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'loading': return 'Testing...'
      case 'success': return 'Connected'
      case 'error': return 'Failed'
      default: return 'Unknown'
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Simple CMS Test</h1>
        <p className="text-muted-foreground mt-2">
          Testing Strapi CMS connection without complex dependencies
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Environment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Strapi URL:</p>
              <p className="text-sm text-muted-foreground">
                {process.env.NEXT_PUBLIC_STRAPI_URL || 'Not configured'}
              </p>
            </div>
            <div>
              <p className="font-medium">API Token:</p>
              <p className="text-sm text-muted-foreground">
                {process.env.STRAPI_API_TOKEN ? 'Configured' : 'Not configured'}
              </p>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {getStatusIcon(testResults.strapiConnection)}
              <div>
                <p className="font-medium">Strapi Connection</p>
                <p className="text-sm text-muted-foreground">
                  {getStatusText(testResults.strapiConnection)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {getStatusIcon(testResults.products)}
              <div>
                <p className="font-medium">Products API</p>
                <p className="text-sm text-muted-foreground">
                  {getStatusText(testResults.products)}
                  {testResults.products === 'success' && ` (${data.products.length} items)`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {getStatusIcon(testResults.categories)}
              <div>
                <p className="font-medium">Categories API</p>
                <p className="text-sm text-muted-foreground">
                  {getStatusText(testResults.categories)}
                  {testResults.categories === 'success' && ` (${data.categories.length} items)`}
                </p>
              </div>
            </div>
          </div>

          {/* Sample Data */}
          {testResults.products === 'success' && data.products.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Sample Products:</h3>
              <div className="space-y-2">
                {data.products.map((product: any) => (
                  <div key={product.id} className="p-2 border rounded">
                    <p className="font-medium">{product.attributes?.name || 'Unnamed Product'}</p>
                    <p className="text-sm text-muted-foreground">
                      ${product.attributes?.price || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {testResults.categories === 'success' && data.categories.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Sample Categories:</h3>
              <div className="flex flex-wrap gap-2">
                {data.categories.map((category: any) => (
                  <span key={category.id} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {category.attributes?.name || 'Unnamed Category'}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button onClick={testStrapiConnection} className="w-full">
            Retest Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
