'use client';

import React from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Truck, 
  CreditCard,
  ArrowRight,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CartItem {
  _id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface EnhancedCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnhancedCart({ isOpen, onClose }: EnhancedCartProps) {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();

  // Load cart data
  React.useEffect(() => {
    if (isOpen && user) {
      // loadCart(); // This function is no longer needed as cart state is managed by useCart
    }
  }, [isOpen, user]);

  // const loadCart = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch('/api/cart', {
  //       credentials: 'include',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       }
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setCart(data.cart);
  //     } else {
  //       console.error('Failed to load cart');
  //     }
  //   } catch (error) {
  //     console.error('Error loading cart:', error);
  //     toast.error('Failed to load cart');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const updateQuantity = async (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
  //   if (!cart) return;

  //   try {
  //     setUpdating(productId);
      
  //     const response = await fetch('/api/cart', {
  //       method: 'PUT',
  //       credentials: 'include',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         productId,
  //         quantity,
  //         selectedSize,
  //         selectedColor
  //       })
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setCart(data.cart);
  //       toast.success('Cart updated successfully');
  //     } else {
  //       const errorData = await response.json();
  //       toast.error(errorData.error || 'Failed to update cart');
  //     }
  //   } catch (error) {
  //     console.error('Error updating cart:', error);
  //     toast.error('Failed to update cart');
  //   } finally {
  //     setUpdating(null);
  //   }
  // };

  // const removeItem = async (productId: string, selectedSize?: string, selectedColor?: string) => {
  //   if (!cart) return;

  //   try {
  //     await updateQuantity(productId, 0, selectedSize, selectedColor);
  //   } catch (error) {
  //     console.error('Error removing item:', error);
  //   }
  // };

  // const clearCart = async () => {
  //   if (!cart) return;

  //   try {
  //     const response = await fetch('/api/cart', {
  //       method: 'DELETE',
  //       credentials: 'include',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       }
  //     });

  //     if (response.ok) {
  //       setCart({
  //         ...cart,
  //         items: [],
  //         total: 0,
  //         itemCount: 0
  //       });
  //       toast.success('Cart cleared successfully');
  //     } else {
  //       toast.error('Failed to clear cart');
  //     }
  //   } catch (error) {
  //     console.error('Error clearing cart:', error);
  //     toast.error('Failed to clear cart');
  //   }
  // };

  const proceedToCheckout = () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      router.push('/auth/signin');
      return;
    }

    if (!state || state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    router.push('/checkout');
    onClose();
  };

  const addToWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId })
      });

      if (response.ok) {
        toast.success('Added to wishlist');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6" />
              <h2 className="text-xl font-semibold">
                Shopping Cart ({state?.itemCount || 0})
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {state && state.items.length > 0 ? (
          <div className="space-y-4">
            {state.items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex space-x-4 p-4 border border-gray-200 rounded-lg">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.image || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500 mt-1">
                          Size: {item.selectedSize}
                        </p>
                      )}
                      
                      {item.selectedColor && (
                        <p className="text-xs text-gray-500 mt-1">
                          Color: {item.selectedColor}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-medium text-gray-900">
                          ${item.product.price.usd.toFixed(2)}
                        </p>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(
                              item.id, 
                              Math.max(0, item.quantity - 1)
                            )}
                            disabled={false}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(
                              item.id, 
                              item.quantity + 1
                            )}
                            disabled={false}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-medium text-gray-900">
                          Total: ${(item.product.price.usd * item.quantity).toFixed(2)}
                        </p>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addToWishlist(item.product.id.toString())}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Start shopping to add items to your cart
                </p>
                <Button onClick={() => router.push('/shop')}>
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {state && state.items.length > 0 && (
            <div className="border-t border-gray-100 p-6 space-y-4">
              {/* Cart Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({state.itemCount} items)</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${(state.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${(state.total * 1.1).toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={proceedToCheckout}
                  className="w-full bg-black hover:bg-gray-900"
                  size="lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/shop')}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Estimated delivery: 3-5 business days
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
