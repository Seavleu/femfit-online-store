import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest } from '@/lib/supabaseServer';
import { supabase } from '@/lib/supabase';

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const { user, response } = await authenticateApiRequest();
    if (response) return response; // Return unauthorized response if no user

    // Find user's cart using Supabase
    const { data: cart, error } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error || !cart) {
      // Return empty cart if no cart exists
      return NextResponse.json({
        success: true,
        cart: {
          items: [],
          total: 0,
          itemCount: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({
      success: true,
      cart
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { user, response } = await authenticateApiRequest();
    if (response) return response; // Return unauthorized response if no user

    const body = await request.json();
    const { productId, quantity, selectedSize, selectedColor } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    // Get product details using Supabase
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check stock availability
    if (product.stock_quantity < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Find existing cart or create new one using Supabase
    let { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (cartError || !cart) {
      // Create new cart
      const newCart = {
        user_id: user.id,
        items: [{
          productId,
          quantity,
          selectedSize,
          selectedColor,
          price: product.price,
          name: product.name,
          image: product.primary_image || product.images?.[0],
          added_at: new Date().toISOString()
        }],
        total: product.price * quantity,
        itemCount: quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: createdCart, error: createError } = await supabase
        .from('carts')
        .insert(newCart)
        .select()
        .single();
        
      if (createError) {
        throw new Error('Failed to create cart');
      }
      
      cart = createdCart;
    } else {
      // Update existing cart
      const existingItemIndex = cart.items.findIndex((item: any) => 
        item.productId === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].updated_at = new Date().toISOString();
      } else {
        // Add new item
        cart.items.push({
          productId,
          quantity,
          selectedSize,
          selectedColor,
          price: product.price,
          name: product.name,
          image: product.primary_image || product.images?.[0],
          added_at: new Date().toISOString()
        });
      }
      
      // Recalculate totals
      cart.total = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      cart.itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      cart.updated_at = new Date().toISOString();
      
      const { error: updateError } = await supabase
        .from('carts')
        .update(cart)
        .eq('id', cart.id);
        
      if (updateError) {
        throw new Error('Failed to update cart');
      }
    }

    return NextResponse.json({
      success: true,
      cart,
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// PUT /api/cart - Update cart item
export async function PUT(request: NextRequest) {
  try {
    const { user, response } = await authenticateApiRequest();
    if (response) return response; // Return unauthorized response if no user

    const body = await request.json();
    const { productId, quantity, selectedSize, selectedColor } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    // Get product details for price calculation using Supabase
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check stock availability
    if (product.stock_quantity < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Find user's cart using Supabase
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (cartError || !cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Find and update item
    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId === productId && 
              item.selectedSize === selectedSize && 
              item.selectedColor === selectedColor
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate totals
    cart.itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    cart.total = cart.items.reduce((sum: number, item: any) => {
      return sum + (product.price * item.quantity);
    }, 0);
    cart.updated_at = new Date().toISOString();

    // Update cart using Supabase
    const { error: updateError } = await supabase
      .from('carts')
      .update(cart)
      .eq('id', cart.id);
      
    if (updateError) {
      throw new Error('Failed to update cart');
    }

    return NextResponse.json({
      success: true,
      cart,
      message: 'Cart updated successfully'
    });

  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    const { user, response } = await authenticateApiRequest();
    if (response) return response; // Return unauthorized response if no user

    // Clear user's cart using Supabase
    const { error: clearError } = await supabase
      .from('carts')
      .update({ 
        items: [], 
        total: 0, 
        itemCount: 0, 
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', user.id);
      
    if (clearError) {
      throw new Error('Failed to clear cart');
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
