import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (code) {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL('/auth/error?message=Authentication failed', request.url));
      }
      
      if (data.session) {
        // Successfully authenticated, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    
    // No code provided, redirect to sign in
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/auth/error?message=Unexpected error', request.url));
  }
}
