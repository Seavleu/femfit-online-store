import { NextRequest, NextResponse } from 'next/server';
import { payWayService } from '@/lib/payway';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify the webhook signature if needed
    // const signature = request.headers.get('x-payway-signature');
    
    // Extract transaction details from webhook
    const { transaction_id, status, order_id } = body;
    
    if (!transaction_id) {
      return NextResponse.json(
        { error: 'Missing transaction_id' },
        { status: 400 }
      );
    }

    // Get transaction details from ABA PayWay
    const transactionDetails = await payWayService.getTransactionDetails(transaction_id);
    
    if (!transactionDetails.success) {
      return NextResponse.json(
        { error: 'Failed to fetch transaction details' },
        { status: 400 }
      );
    }

    // Process the webhook based on transaction status
    switch (status) {
      case 'completed':
        // Handle successful payment
        console.log(`Payment completed for order ${order_id}`);
        // Update your database, send confirmation emails, etc.
        break;
        
      case 'failed':
        // Handle failed payment
        console.log(`Payment failed for order ${order_id}`);
        // Update order status, notify customer, etc.
        break;
        
      case 'cancelled':
        // Handle cancelled payment
        console.log(`Payment cancelled for order ${order_id}`);
        // Update order status
        break;
        
      default:
        console.log(`Unknown payment status: ${status} for order ${order_id}`);
    }

    // Return success response to acknowledge webhook
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}