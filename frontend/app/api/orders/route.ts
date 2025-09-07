import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticateApiRequest } from '@/lib/supabaseServer';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateApiRequest();
    
    if (!authResult.user) {
      return authResult.response;
    }

    const { user } = authResult;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const db = await connectToDatabase();
    const orders = db.collection('orders');

    // Build filter
    const filter: any = { userId: user.id };
    if (status) {
      filter.status = status;
    }

    // Get orders with pagination
    const [ordersResult, totalCount] = await Promise.all([
      orders
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      orders.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      orders: ordersResult,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateApiRequest();
    
    if (!authResult.user) {
      return authResult.response;
    }

    const { user } = authResult;
    const body = await request.json();
    const { 
      items, 
      shippingAddress, 
      billingAddress, 
      paymentMethod, 
      promoCode,
      notes 
    } = body;

    if (!items || !shippingAddress || !billingAddress || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const orders = db.collection('orders');
    const carts = db.collection('carts');
    const products = db.collection('products');

    // Validate items and calculate totals
    let subtotal = 0;
    let totalItems = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await products.findOne({ 
        _id: item.productId,
        isActive: true 
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.totalStock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      totalItems += item.quantity;

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        productImage: product.images?.[0]?.url || product.primaryImage?.url,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      });
    }

    // Calculate shipping and taxes
    const shippingCost = 0; // Free shipping for now
    const taxRate = 0.1; // 10% tax
    const taxAmount = subtotal * taxRate;
    const total = subtotal + shippingCost + taxAmount;

    // Create order
    const order = {
      userId: user.id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      subtotal,
      shippingCost,
      taxAmount,
      total,
      totalItems,
      status: 'pending',
      shippingAddress,
      billingAddress,
      paymentMethod,
      promoCode: promoCode || null,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await orders.insertOne(order);

    // Clear user's cart after successful order
    await carts.updateOne(
      { userId: user.id },
      { 
        $set: { 
          items: [],
          total: 0,
          itemCount: 0,
          updatedAt: new Date()
        }
      }
    );

    // Update product stock
    for (const item of items) {
      await products.updateOne(
        { _id: item.productId },
        { $inc: { totalStock: -item.quantity, sales: item.quantity } }
      );
    }

    return NextResponse.json({
      success: true,
      order: { ...order, _id: result.insertedId },
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Helper function to generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORD-${timestamp.slice(-6)}-${random}`;
}
