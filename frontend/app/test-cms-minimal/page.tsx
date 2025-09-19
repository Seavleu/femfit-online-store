'use client'

import { useState } from 'react'

export default function MinimalCMSTest() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
      const response = await fetch(`${strapiUrl}/api/product-content-types?pagination[pageSize]=1`)
      
      if (response.ok) {
        const data = await response.json()
        setResult(`✅ SUCCESS: Connected to Strapi!\n\nURL: ${strapiUrl}\nProducts found: ${data.data?.length || 0}\n\nResponse: ${JSON.stringify(data, null, 2)}`)
      } else {
        setResult(`❌ ERROR: HTTP ${response.status} - ${response.statusText}`)
      }
    } catch (error) {
      setResult(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Minimal CMS Test</h1>
      <p>Environment: {process.env.NODE_ENV}</p>
      <p>Strapi URL: {process.env.NEXT_PUBLIC_STRAPI_URL || 'Not set'}</p>
      <p>API Token: {process.env.STRAPI_API_TOKEN ? 'Set' : 'Not set'}</p>
      
      <button 
        onClick={testConnection}
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
    </div>
  )
}
