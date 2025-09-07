import { NextResponse } from 'next/server';
import { getUserOrders } from '@/lib/database';
import { authenticateApiRequest } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const { user, response } = await authenticateApiRequest();
    if (response) return response; // Return unauthorized response if no user
    
    const { data, error } = await getUserOrders(user.id);
    if (error) return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 });
    return NextResponse.json({ orders: data || [] });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


