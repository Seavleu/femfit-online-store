import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest } from '@/lib/supabaseServer';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ErrorHandler, DatabaseError, AuthorizationError } from '@/lib/errorHandling';

/**
 * GET /api/orders/payment-intent/[id] - Get order details by payment intent ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentIntentId } = await params;
    
    if (!paymentIntentId) {
      return NextResponse.json(
        { success: false, error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    const { user, response } = await authenticateApiRequest();
    if (response) return response; // Return unauthorized response if no user

    // Find order by payment intent ID using Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_intent_id', paymentIntentId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user owns this order or is admin
    const isOwner = order.user_id === user.id;
    const isAdmin = user.user_metadata?.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      throw new AuthorizationError('Access denied to this order');
    }

    // Format order data for response
    const orderData = {
      orderId: order.id,
      orderNumber: order.order_number,
      totalAmount: order.total_amount,
      currency: 'USD',
      status: order.status,
      paymentStatus: order.payment_status,
      items: [], // Will need to fetch from order_items table if needed
      customerEmail: '', // Will need to fetch from users table if needed
      shippingAddress: order.shipping_address,
      billingAddress: order.billing_address,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      estimatedDelivery: order.estimated_delivery || '3-5 business days',
      paymentMethod: order.payment_method,
      trackingNumber: order.tracking_number,
    };

    logger.info('Order details retrieved:', {
      orderId: orderData.orderId,
      paymentIntentId,
      userId: user.id
    });

    return NextResponse.json({
      success: true,
      order: orderData
    });

  } catch (error) {
    const appError = ErrorHandler.normalizeError(error, {
      component: 'OrderAPI',
      action: 'GET_ORDER_BY_PAYMENT_INTENT',
      timestamp: new Date().toISOString()
    });

    appError.log();

    if (appError instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, error: appError.message },
        { status: 403 }
      );
    }

    if (appError instanceof DatabaseError) {
      return NextResponse.json(
        { success: false, error: 'Database error occurred' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
