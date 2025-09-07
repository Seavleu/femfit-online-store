import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticateApiRequest } from '@/lib/supabaseServer';

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateApiRequest();
    
    if (!authResult.user) {
      return authResult.response;
    }

    const { user } = authResult;
    const db = await connectToDatabase();
    const wishlists = db.collection('wishlists');

    // Find user's wishlist
    const wishlist = await wishlists.findOne({ userId: user.id });
    
    if (!wishlist) {
      return NextResponse.json({
        success: true,
        wishlist: {
          items: [],
          totalItems: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    // Populate product details for wishlist items
    const products = db.collection('products');
    const populatedItems = await Promise.all(
      wishlist.items.map(async (item: any) => {
        const product = await products.findOne(
          { _id: item.productId, isActive: true },
          { projection: { name: 1, price: 1, images: 1, primaryImage: 1, category: 1, description: 1 } }
        );
        
        if (product) {
          return {
            ...item,
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.images?.[0]?.url || product.primaryImage?.url,
              category: product.category,
              description: product.description
            }
          };
        }
        return null;
      })
    );

    // Filter out null items (products that no longer exist)
    const validItems = populatedItems.filter(item => item !== null);
    
    return NextResponse.json({
      success: true,
      wishlist: {
        ...wishlist,
        items: validItems,
        totalItems: validItems.length
      }
    });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateApiRequest();
    
    if (!authResult.user) {
      return authResult.response;
    }

    const { user } = authResult;
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const wishlists = db.collection('wishlists');
    const products = db.collection('products');

    // Verify product exists and is active
    const product = await products.findOne({ 
      _id: productId,
      isActive: true 
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Find existing wishlist or create new one
    let wishlist: any = await wishlists.findOne({ userId: user.id });
    
    if (!wishlist) {
      wishlist = {
        userId: user.id,
        items: [],
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    // Check if item already exists in wishlist
    const existingItem = wishlist.items.find(
      (item: any) => item.productId === productId
    );

    if (existingItem) {
      return NextResponse.json(
        { success: false, error: 'Product already in wishlist' },
        { status: 400 }
      );
    }

    // Add new item
    wishlist.items.push({
      productId,
      addedAt: new Date()
    });

    wishlist.totalItems = wishlist.items.length;
    wishlist.updatedAt = new Date();

    // Upsert wishlist
    await wishlists.updateOne(
      { userId: user.id },
      { $set: wishlist },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      wishlist,
      message: 'Product added to wishlist successfully'
    });

  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await authenticateApiRequest();
    
    if (!authResult.user) {
      return authResult.response;
    }

    const { user } = authResult;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const wishlists = db.collection('wishlists');

    // Find user's wishlist
    const wishlist = await wishlists.findOne({ userId: user.id });
    
    if (!wishlist) {
      return NextResponse.json(
        { success: false, error: 'Wishlist not found' },
        { status: 404 }
      );
    }

    // Remove item from wishlist
    const updatedItems = wishlist.items.filter(
      (item: any) => item.productId !== productId
    );

    wishlist.items = updatedItems;
    wishlist.totalItems = updatedItems.length;
    wishlist.updatedAt = new Date();

    // Update wishlist
    await wishlists.updateOne(
      { userId: user.id },
      { $set: wishlist }
    );

    return NextResponse.json({
      success: true,
      wishlist,
      message: 'Product removed from wishlist successfully'
    });

  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
