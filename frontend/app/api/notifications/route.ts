import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest } from '@/lib/supabaseServer';
import { supabase } from '@/lib/supabase';

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const { user, response } = await authenticateApiRequest();
    if (response) return response; // Return unauthorized response if no user

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    // Build filter for Supabase
    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    // Get notifications with pagination
    const { data: notificationsResult, error, count } = await query
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw new Error('Failed to fetch notifications');
    }

    // Calculate pagination info
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      notifications: notificationsResult,
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
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create notification (internal use)
export async function POST(request: NextRequest) {
  try {
    const { user, response } = await authenticateApiRequest();
    if (response) return response; // Return unauthorized response if no user

    const body = await request.json();
    const { 
      type, 
      title, 
      message, 
      orderId, 
      productId, 
      actionUrl,
      priority = 'normal' 
    } = body;

    if (!type || !title || !message) {
      return NextResponse.json(
        { success: false, error: 'Type, title, and message are required' },
        { status: 400 }
      );
    }

    // Create notification using Supabase
    const notification = {
      user_id: user.id,
      type,
      title,
      message,
      order_id: orderId || null,
      product_id: productId || null,
      action_url: actionUrl || null,
      priority,
      read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: createdNotification, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
    
    if (error || !createdNotification) {
      return NextResponse.json(
        { success: false, error: 'Failed to create notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notification: createdNotification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const { user, response } = await authenticateApiRequest();
    if (response) return response; // Return unauthorized response if no user

    const body = await request.json();
    const { notificationIds, markAllAsRead = false } = body;

    let result;

    if (markAllAsRead) {
      // Mark all user notifications as read using Supabase
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false);
        
      if (error) {
        throw new Error('Failed to update notifications');
      }
      
      result = { modifiedCount: 1 }; // Supabase doesn't return modified count
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read using Supabase
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .in('id', notificationIds)
        .eq('user_id', user.id);
        
      if (error) {
        throw new Error('Failed to update notifications');
      }
      
      result = { modifiedCount: notificationIds.length }; // Supabase doesn't return modified count
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications marked as read successfully',
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const { user, response } = await authenticateApiRequest();
    if (response) return response; // Return unauthorized response if no user

    const { searchParams } = new URL(request.url);
    const notificationIds = searchParams.get('ids')?.split(',');
    const deleteAll = searchParams.get('deleteAll') === 'true';

    let result;

    if (deleteAll) {
      // Delete all user notifications using Supabase
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);
        
      if (error) {
        throw new Error('Failed to delete notifications');
      }
      
      result = { deletedCount: 1 }; // Supabase doesn't return deleted count
    } else if (notificationIds && notificationIds.length > 0) {
      // Delete specific notifications using Supabase
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .in('id', notificationIds)
        .eq('user_id', user.id);
        
      if (error) {
        throw new Error('Failed to delete notifications');
      }
      
      result = { deletedCount: notificationIds.length }; // Supabase doesn't return deleted count
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications deleted successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete notifications' },
      { status: 500 }
    );
  }
}
