import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      // If we have a Strapi JWT, verify it with Strapi
      if (decoded.strapiJwt && decoded.strapiJwt !== 'mock-jwt-token') {
        try {
          const strapiResponse = await fetch(`${STRAPI_URL}/api/users/me`, {
            headers: {
              'Authorization': `Bearer ${decoded.strapiJwt}`
            }
          })

          if (!strapiResponse.ok) {
            return NextResponse.json(
              { message: 'Strapi token expired' },
              { status: 401 }
            )
          }

          const strapiUser = await strapiResponse.json()
          
          return NextResponse.json({
            valid: true,
            user: {
              id: decoded.userId,
              email: decoded.email,
              role: decoded.role,
              strapiUser: strapiUser
            }
          })
        } catch (strapiError) {
          console.error('Strapi verification error:', strapiError)
          // Fall through to our JWT verification if Strapi is unavailable
        }
      }
      
      // Fallback to our JWT verification
      return NextResponse.json({
        valid: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role
        }
      })
    } catch (jwtError) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
