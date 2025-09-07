'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
}

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: 'payway' | 'cod' | 'card' | 'paypal';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

interface CheckoutFlowProps {
  onComplete: (orderId: string) => void;
}

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'review' | 'complete';

export default function CheckoutFlow({ onComplete }: CheckoutFlowProps) {
  const { user, session } = useSupabaseAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form data
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Cambodia'
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Cambodia'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'payway'
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [notes, setNotes] = useState('');

  // Load cart data
  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  // Update billing address when shipping address changes
  useEffect(() => {
    if (useSameAddress) {
      setBillingAddress(shippingAddress);
    }
  }, [shippingAddress, useSameAddress]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        
        if (data.cart.items.length === 0) {
          toast.error('Your cart is empty');
          router.push('/shop');
        }
      } else {
        toast.error('Failed to load cart');
        router.push('/shop');
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
      router.push('/shop');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 'cart') setCurrentStep('shipping');
    else if (currentStep === 'shipping') setCurrentStep('payment');
    else if (currentStep === 'payment') setCurrentStep('review');
  };

  const prevStep = () => {
    if (currentStep === 'shipping') setCurrentStep('cart');
    else if (currentStep === 'payment') setCurrentStep('shipping');
    else if (currentStep === 'review') setCurrentStep('payment');
  };

  const validateStep = (): boolean => {
    if (currentStep === 'shipping') {
      const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
      for (const field of required) {
        if (!shippingAddress[field as keyof Address]) {
          toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          return false;
        }
      }
    } else if (currentStep === 'payment') {
      if (paymentMethod.type === 'card') {
        const required = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
        for (const field of required) {
          if (!paymentMethod[field as keyof PaymentMethod]) {
            toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  const placeOrder = async () => {
    if (!cart || !session) return;

    try {
      setProcessing(true);
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
          shippingAddress,
          billingAddress,
          paymentMethod,
          promoCode: promoCode || null,
          notes: notes || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentStep('complete');
        onComplete(data.order._id);
        toast.success('Order placed successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const steps = [
    { id: 'cart', label: 'Cart Review', icon: ShoppingBag },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2",
                index <= currentStepIndex
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-400"
              )}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "ml-2 text-sm font-medium",
                index <= currentStepIndex ? "text-black" : "text-gray-400"
              )}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-16 h-0.5 mx-4",
                  index < currentStepIndex ? "bg-black" : "bg-gray-300"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {currentStep === 'cart' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Cart Review</h2>
            
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.productImage || '/placeholder-product.jpg'}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    {item.selectedSize && <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>}
                    {item.selectedColor && <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>}
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total ({cart.itemCount} items)</span>
                <span className="text-2xl font-bold">${cart.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} size="lg">
                Continue to Shipping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'shipping' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={shippingAddress.firstName}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={shippingAddress.lastName}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useSameAddress"
                checked={useSameAddress}
                onChange={(e) => setUseSameAddress(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="useSameAddress">Use same address for billing</Label>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
              <Button onClick={handleNext} size="lg">
                Continue to Payment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'payment' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Payment Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="card"
                  name="paymentType"
                  value="card"
                  checked={paymentMethod.type === 'card'}
                  onChange={(e) => setPaymentMethod(prev => ({ ...prev, type: e.target.value as 'card' | 'paypal' }))}
                  className="text-black"
                />
                <Label htmlFor="card">Credit/Debit Card</Label>
                
                <input
                  type="radio"
                  id="paypal"
                  name="paymentType"
                  value="paypal"
                  checked={paymentMethod.type === 'paypal'}
                  onChange={(e) => setPaymentMethod(prev => ({ ...prev, type: e.target.value as 'card' | 'paypal' }))}
                  className="text-black"
                />
                <Label htmlFor="paypal">PayPal</Label>
              </div>

              {paymentMethod.type === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      value={paymentMethod.cardholderName || ''}
                      onChange={(e) => setPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={paymentMethod.cardNumber || ''}
                      onChange={(e) => setPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        value={paymentMethod.expiryDate || ''}
                        onChange={(e) => setPaymentMethod(prev => ({ ...prev, expiryDate: e.target.value }))}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={paymentMethod.cvv || ''}
                        onChange={(e) => setPaymentMethod(prev => ({ ...prev, cvv: e.target.value }))}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod.type === 'paypal' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    You will be redirected to PayPal to complete your payment after reviewing your order.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shipping
              </Button>
              <Button onClick={handleNext} size="lg">
                Review Order
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'review' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Review Your Order</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-sm">
                      <span>{item.productName} x {item.quantity}</span>
                      <span>${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%)</span>
                    <span>${(cart.total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(cart.total * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Billing */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                    <p>{shippingAddress.country}</p>
                    <p>{shippingAddress.email}</p>
                    <p>{shippingAddress.phone}</p>
                  </div>
                </div>

                {!useSameAddress && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Billing Address</h3>
                    <div className="text-sm text-gray-600">
                      <p>{billingAddress.firstName} {billingAddress.lastName}</p>
                      <p>{billingAddress.address}</p>
                      <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}</p>
                      <p>{billingAddress.country}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                  <div className="text-sm text-gray-600">
                    <p>{paymentMethod.type === 'card' ? 'Credit/Debit Card' : 'PayPal'}</p>
                    {paymentMethod.type === 'card' && paymentMethod.cardNumber && (
                      <p>•••• •••• •••• {paymentMethod.cardNumber.slice(-4)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                <Input
                  id="promoCode"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                />
              </div>
              <div>
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Payment
              </Button>
              <Button 
                onClick={placeOrder} 
                size="lg" 
                disabled={processing}
                className="bg-green-600 hover:bg-green-700"
              >
                <Lock className="w-4 h-4 mr-2" />
                {processing ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. You will receive an email confirmation shortly.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push('/dashboard')}>
                View Orders
              </Button>
              <Button variant="outline" onClick={() => router.push('/shop')}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
