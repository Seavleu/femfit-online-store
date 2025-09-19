'use client'

import { useState } from 'react'
import { useProducts, useCategories } from '@/hooks/useCMS'

export default function APIFixTest() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  // Test the hooks directly
  const { products, isLoading: productsLoading, error: productsError } = useProducts({ 
    pagination: { pageSize: 3 } 
  })
  
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories()

  const testDirectAPI = async () => {
    setLoading(true)
    setResult('Testing direct API calls...')
    
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
      
      // Test products with correct populate format
      const productsResponse = await fetch(`${strapiUrl}/api/product-content-types?populate[0]=images&populate[1]=category&populate[2]=seo&pagination[pageSize]=3`)
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setResult(`✅ SUCCESS: Direct API call working!\n\nProducts found: ${productsData.data?.length || 0}\n\nFirst product: ${productsData.data?.[0]?.name || 'None'}\n\nResponse: ${JSON.stringify(productsData, null, 2)}`)
      } else {
        const errorText = await productsResponse.text()
        setResult(`❌ ERROR: ${productsResponse.status} - ${errorText}`)
      }
    } catch (error) {
      setResult(`❌ CONNECTION ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Fix Test</h1>
      <p>Testing the corrected Strapi API format</p>
      
      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f0f8ff', border: '1px solid #007bff', borderRadius: '4px' }}>
        <h3>🔧 Test Results</h3>
        <p><strong>Products Hook:</strong> {productsLoading ? 'Loading...' : productsError ? `Error: ${productsError.message}` : `✅ ${products.length} products loaded`}</p>
        <p><strong>Categories Hook:</strong> {categoriesLoading ? 'Loading...' : categoriesError ? `Error: ${categoriesError.message}` : `✅ ${categories.length} categories loaded`}</p>
      </div>
      
      <button 
        onClick={testDirectAPI}
        disabled={loading}
        style={{
          padding: '10px 20px',
          margin: '10px 0',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Direct API Call'}
      </button>
      
      <pre style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        marginTop: '20px',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        {result || 'Click the button above to test the direct API call'}
      </pre>
      
      {products.length > 0 && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', border: '1px solid #28a745', borderRadius: '4px' }}>
          <h3>🎉 Products Loaded Successfully!</h3>
          {products.map((product: any) => (
            <div key={product.id} style={{ margin: '10px 0', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
              <h4>{product.attributes?.name || 'Unnamed Product'}</h4>
              <p>Price: ${product.attributes?.price || 'N/A'}</p>
              <p>Status: {product.attributes?.productStatus || 'Unknown'}</p>
              {product.attributes?.images?.data?.length > 0 && (
                <p>Images: {product.attributes.images.data.length} found</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
