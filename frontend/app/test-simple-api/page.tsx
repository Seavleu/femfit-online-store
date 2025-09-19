'use client'

import { useState } from 'react'

export default function SimpleAPITest() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testAPI = async (endpoint: string, description: string) => {
    setLoading(true)
    setResult(`Testing ${description}...`)
    
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
      const response = await fetch(`${strapiUrl}${endpoint}`)
      
      if (response.ok) {
        const data = await response.json()
        setResult(`✅ SUCCESS: ${description}\n\nData: ${JSON.stringify(data, null, 2)}`)
      } else {
        const errorText = await response.text()
        setResult(`❌ ERROR: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      setResult(`❌ CONNECTION ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Simple API Test</h1>
      <p>Testing Strapi API endpoints with different parameter formats</p>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '20px 0' }}>
        <button 
          onClick={() => testAPI('/api/product-content-types?populate=*', 'Products with populate=*')}
          disabled={loading}
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Test Products (*)
        </button>
        
        <button 
          onClick={() => testAPI('/api/product-content-types?populate[0]=images&populate[1]=category', 'Products with array populate')}
          disabled={loading}
          style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Test Products (Array)
        </button>
        
        <button 
          onClick={() => testAPI('/api/category-content-types?populate=*', 'Categories with populate=*')}
          disabled={loading}
          style={{ padding: '10px 15px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Test Categories (*)
        </button>
        
        <button 
          onClick={() => testAPI('/api/category-content-types', 'Categories without populate')}
          disabled={loading}
          style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Test Categories (None)
        </button>
      </div>
      
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
        {result || 'Click a button above to test different API endpoints'}
      </pre>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', border: '1px solid #6c757d', borderRadius: '4px' }}>
        <h3>🔍 Debugging Steps</h3>
        <ol>
          <li>Test each endpoint to see which format works</li>
          <li>Check if categories exist in Strapi admin</li>
          <li>Verify the field names match the content type schema</li>
          <li>Update the Strapi client based on working format</li>
        </ol>
      </div>
    </div>
  )
}
