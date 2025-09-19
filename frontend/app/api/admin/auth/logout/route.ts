import { NextRequest, NextResponse } from 'next/server'

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

    // In a production environment, you would:
    // 1. Add the token to a blacklist
    // 2. Store blacklisted tokens in Redis or database
    // 3. Check blacklist on token verification

    // For now, we'll just log the logout
    console.log(`Admin logout: token ${token.substring(0, 10)}... at ${new Date().toISOString()}`)

    return NextResponse.json({
      message: 'Logout successful'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
