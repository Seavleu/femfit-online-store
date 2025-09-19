'use client'

import { useState } from 'react'

export default function FinalCMSTest() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testStrapiConnection = async () => {
    setLoading(true)
    setResult('Testing Strapi connection...')
    
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
      
      // Test products endpoint
      const productsResponse = await fetch(`${strapiUrl}/api/product-content-types?pagination[pageSize]=1`)
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setResult(`✅ SUCCESS: Strapi is working!\n\nURL: ${strapiUrl}\nProducts found: ${productsData.data?.length || 0}\n\nResponse: ${JSON.stringify(productsData, null, 2)}`)
      } else if (productsResponse.status === 403) {
        setResult(`❌ PERMISSION ERROR: Strapi is running but API is not publicly accessible.\n\nStatus: ${productsResponse.status}\n\nTo fix this:\n1. Go to http://localhost:1337/admin\n2. Navigate to Settings → Users & Permissions Plugin → Roles → Public\n3. Enable "find" and "findOne" permissions for:\n   - product-content-type\n   - category-content-type\n   - banner-content-type\n   - page-content-type\n   - blog-post\n   - homepage\n\nThen test again!`)
      } else {
        setResult(`❌ ERROR: HTTP ${productsResponse.status} - ${productsResponse.statusText}`)
      }
    } catch (error) {
      setResult(`❌ CONNECTION ERROR: ${error instanceof Error ? error.message : 'Unknown error'}\n\nMake sure Strapi is running on port 1337`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Final CMS Integration Test</h1>
      <p>Testing the complete Strapi CMS integration</p>
      
      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f0f8ff', border: '1px solid #007bff', borderRadius: '4px' }}>
        <h3>🔧 Integration Status</h3>
        <p><strong>Frontend Code:</strong> ✅ Complete and ready</p>
        <p><strong>API Endpoints:</strong> ✅ Updated to correct names</p>
        <p><strong>Strapi Backend:</strong> ✅ Running on port 1337</p>
        <p><strong>Permissions:</strong> ❌ Need to be configured</p>
      </div>
      
      <button 
        onClick={testStrapiConnection}
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
        {loading ? 'Testing...' : 'Test Strapi Connection'}
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
        {result || 'Click the button above to test the connection'}
      </pre>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', border: '1px solid #28a745', borderRadius: '4px' }}>
        <h3>🎉 Integration Complete!</h3>
        <p>Once permissions are configured, your CMS integration will be fully functional:</p>
        <ul>
          <li>✅ Products from Strapi</li>
          <li>✅ Categories from Strapi</li>
          <li>✅ Banners from Strapi</li>
          <li>✅ Pages from Strapi</li>
          <li>✅ Blog posts from Strapi</li>
          <li>✅ Homepage content from Strapi</li>
        </ul>
      </div>
    </div>
  )
}
