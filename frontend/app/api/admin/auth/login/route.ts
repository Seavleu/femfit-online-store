import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
  'super_admin': [
    'dashboard:view',
    'dashboard:analytics',
    'products:view',
    'products:create',
    'products:edit',
    'products:delete',
    'products:bulk',
    'orders:view',
    'orders:edit',
    'orders:process',
    'orders:refund',
    'customers:view',
    'customers:edit',
    'customers:delete',
    'inventory:view',
    'inventory:edit',
    'inventory:alerts',
    'content:view',
    'content:edit',
    'content:publish',
    'reports:view',
    'reports:export',
    'settings:view',
    'settings:edit',
    'users:view',
    'users:create',
    'users:edit',
    'users:delete',
  ],
  'admin': [
    'dashboard:view',
    'dashboard:analytics',
    'products:view',
    'products:create',
    'products:edit',
    'products:delete',
    'products:bulk',
    'orders:view',
    'orders:edit',
    'orders:process',
    'customers:view',
    'customers:edit',
    'inventory:view',
    'inventory:edit',
    'content:view',
    'content:edit',
    'reports:view',
    'settings:view',
  ],
  'manager': [
    'dashboard:view',
    'products:view',
    'products:create',
    'products:edit',
    'orders:view',
    'orders:edit',
    'customers:view',
    'inventory:view',
    'content:view',
    'content:edit',
    'reports:view',
  ],
  'editor': [
    'dashboard:view',
    'products:view',
    'products:create',
    'products:edit',
    'content:view',
    'content:edit',
  ],
  'viewer': [
    'dashboard:view',
    'products:view',
    'orders:view',
    'customers:view',
    'inventory:view',
    'content:view',
    'reports:view',
  ]
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Try Strapi authentication first
    let strapiUser = null
    let strapiJwt = null
    
    try {
      const authResponse = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email, // Strapi uses 'identifier' for email/username
          password: password
        })
      })

      if (authResponse.ok) {
        const authData = await authResponse.json()
        strapiUser = authData.user
        strapiJwt = authData.jwt
      } else {
        const errorData = await authResponse.json()
        console.error('Strapi auth error:', errorData)
        
        // Fallback to mock authentication for testing
        if (email === 'admin@femfit.com' && password === 'admin123') {
          console.log('Using fallback authentication for testing')
          strapiUser = {
            id: 1,
            email: 'admin@femfit.com',
            username: 'femfit',
            role: { name: 'super_admin' }
          }
          strapiJwt = 'mock-jwt-token'
        } else {
          return NextResponse.json(
            { message: `Authentication failed: ${errorData.message || 'Invalid credentials'}` },
            { status: 401 }
          )
        }
      }
    } catch (error) {
      console.error('Strapi connection error:', error)
      
      // Fallback to mock authentication if Strapi is not available
      if (email === 'admin@femfit.com' && password === 'admin123') {
        console.log('Strapi not available, using fallback authentication')
        strapiUser = {
          id: 1,
          email: 'admin@femfit.com',
          username: 'femfit',
          role: { name: 'super_admin' }
        }
        strapiJwt = 'mock-jwt-token'
      } else {
        return NextResponse.json(
          { message: 'Authentication service unavailable' },
          { status: 503 }
        )
      }
    }

    // Map Strapi user to admin user format
    const adminUser = {
      id: strapiUser.id.toString(),
      email: strapiUser.email,
      username: strapiUser.username,
      name: strapiUser.username || strapiUser.email,
      role: strapiUser.role?.name || 'viewer', // Default to viewer if no role
      permissions: ROLE_PERMISSIONS[strapiUser.role?.name as keyof typeof ROLE_PERMISSIONS] || ROLE_PERMISSIONS.viewer,
      isActive: true,
      lastLogin: new Date().toISOString(),
      avatar: strapiUser.avatar?.url || null
    }

    // Generate our own JWT token for admin session management
    const token = jwt.sign(
      { 
        userId: adminUser.id, 
        email: adminUser.email, 
        role: adminUser.role,
        strapiJwt: strapiJwt // Store Strapi JWT for API calls
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Log login activity
    console.log(`Admin login: ${email} at ${new Date().toISOString()}`)

    return NextResponse.json({
      user: adminUser,
      token,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
