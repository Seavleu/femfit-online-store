import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

// In production, this would be stored in a database
const auditLogs: Array<{
  id: string
  action: string
  description: string
  userId: string
  userEmail: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
}> = []

export async function POST(request: NextRequest) {
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
      
      const { action, description, userId } = await request.json()
      
      const logEntry = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        action,
        description,
        userId: userId || decoded.userId,
        userEmail: decoded.email,
        timestamp: new Date().toISOString(),
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }

      auditLogs.push(logEntry)

      // In production, you would save to database here
      console.log('Audit log:', logEntry)

      return NextResponse.json({
        message: 'Activity logged successfully',
        logId: logEntry.id
      })
    } catch (jwtError) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Audit log error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
      
      // Check if user has permission to view audit logs
      if (decoded.role !== 'super_admin' && decoded.role !== 'admin') {
        return NextResponse.json(
          { message: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '50')
      const action = searchParams.get('action')
      const userId = searchParams.get('userId')

      let filteredLogs = auditLogs

      // Filter by action
      if (action) {
        filteredLogs = filteredLogs.filter(log => log.action === action)
      }

      // Filter by user
      if (userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === userId)
      }

      // Sort by timestamp (newest first)
      filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      // Pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedLogs = filteredLogs.slice(startIndex, endIndex)

      return NextResponse.json({
        logs: paginatedLogs,
        pagination: {
          page,
          limit,
          total: filteredLogs.length,
          pages: Math.ceil(filteredLogs.length / limit)
        }
      })
    } catch (jwtError) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Audit log fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
