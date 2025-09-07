'use client';

import { XCircle, ArrowLeft, ShoppingCart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Cancel Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </div>

        {/* Information Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Happened?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-600">
              <p>
                You cancelled the payment process before it was completed. This can happen when:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You closed the payment window</li>
                <li>You navigated away from the payment page</li>
                <li>You cancelled the payment in your payment method</li>
                <li>There was a technical issue during payment</li>
              </ul>
              <p className="mt-4">
                <strong>Good news:</strong> No money was taken from your account, and your cart items are still saved.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Would You Like to Do?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Try Payment Again</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Return to checkout and complete your purchase with a different payment method.
                </p>
                <Button asChild size="sm">
                  <Link href="/checkout">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to Checkout
                  </Link>
                </Button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Review Your Cart</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Check your cart items and make any changes before trying again.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/cart">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    View Cart
                  </Link>
                </Button>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Continue Shopping</h4>
                <p className="text-sm text-green-700 mb-3">
                  Browse more products and add them to your cart.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/shop">
                    <Home className="w-4 h-4 mr-2" />
                    Browse Products
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-600">
              <p>
                If you're experiencing issues with payments or have questions about your order, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/help">
                    Help Center
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Shop Button */}
        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <Link href="/shop">
              <Home className="w-4 h-4 mr-2" />
              Back to Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}