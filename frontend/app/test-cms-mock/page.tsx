'use client'

import { useState } from 'react'

export default function MockCMSTest() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testMockConnection = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful response
      const mockData = {
        data: [
          {
            id: 1,
            attributes: {
              name: "Sample Product 1",
              slug: "sample-product-1",
              price: 29.99,
              productStatus: "published",
              featured: true,
              images: {
                data: [{
                  id: 1,
                  attributes: {
                    url: "/uploads/sample-product-1.jpg",
                    formats: {
                      thumbnail: { url: "/uploads/thumbnail_sample-product-1.jpg" },
                      small: { url: "/uploads/small_sample-product-1.jpg" },
                      medium: { url: "/uploads/medium_sample-product-1.jpg" }
                    }
                  }
                }]
              },
              category: {
                data: {
                  id: 1,
                  attributes: {
                    name: "Sample Category",
                    slug: "sample-category"
                  }
                }
              }
            }
          },
          {
            id: 2,
            attributes: {
              name: "Sample Product 2",
              slug: "sample-product-2",
              price: 49.99,
              productStatus: "published",
              featured: false,
              images: {
                data: [{
                  id: 2,
                  attributes: {
                    url: "/uploads/sample-product-2.jpg",
                    formats: {
                      thumbnail: { url: "/uploads/thumbnail_sample-product-2.jpg" }
                    }
                  }
                }]
              },
              category: {
                data: {
                  id: 1,
                  attributes: {
                    name: "Sample Category",
                    slug: "sample-category"
                  }
                }
              }
            }
          }
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 2,
            pageCount: 1,
            total: 2
          }
        }
      }
      
      setResult(`✅ SUCCESS: Mock CMS Integration Working!\n\nThis shows what the real integration will look like:\n\nProducts found: ${mockData.data.length}\n\nSample Products:\n${mockData.data.map((product: any) => 
        `- ${product.attributes.name} ($${product.attributes.price}) - ${product.attributes.productStatus}`
      ).join('\n')}\n\nFull Response:\n${JSON.stringify(mockData, null, 2)}`)
      
    } catch (error) {
      setResult(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Mock CMS Integration Test</h1>
      <p>This simulates what the Strapi integration will look like once it's working.</p>
      
      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f0f8ff', border: '1px solid #007bff', borderRadius: '4px' }}>
        <h3>🔧 Strapi Status</h3>
        <p><strong>Current Issue:</strong> Strapi is having startup problems (memory error)</p>
        <p><strong>Solution:</strong> The CMS integration code is ready, just need to fix Strapi startup</p>
        <p><strong>Endpoints Updated:</strong> ✅ All API calls now use correct content type names</p>
      </div>
      
      <button 
        onClick={testMockConnection}
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
        {loading ? 'Testing...' : 'Test Mock Integration'}
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
        {result || 'Click the button above to test the mock integration'}
      </pre>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px' }}>
        <h3>📋 Next Steps to Fix Strapi:</h3>
        <ol>
          <li><strong>Check Strapi logs:</strong> Look for specific error messages</li>
          <li><strong>Reduce memory usage:</strong> Try starting with fewer content types</li>
          <li><strong>Check database:</strong> Ensure SQLite database is accessible</li>
          <li><strong>Environment variables:</strong> Verify all required env vars are set</li>
        </ol>
      </div>
    </div>
  )
}
