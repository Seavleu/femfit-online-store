import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface PaymentState {
  isProcessing: boolean;
  error: string | null;
  success: boolean;
}

interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  metadata?: Record<string, any>;
}

interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

export function usePayment() {
  const [state, setState] = useState<PaymentState>({
    isProcessing: false,
    error: null,
    success: false,
  });

  const createPaymentIntent = useCallback(async (params: CreatePaymentIntentParams): Promise<PaymentIntent | null> => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: params.amount,
          currency: params.currency || 'usd',
          metadata: params.metadata || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      setState(prev => ({ ...prev, isProcessing: false, success: true }));
      
      toast.success('Payment intent created successfully');
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: errorMessage,
        success: false 
      }));
      
      toast.error(errorMessage);
      return null;
    }
  }, []);

  const confirmPayment = useCallback(async (paymentIntentId: string, orderId?: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          orderId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm payment');
      }

      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({ ...prev, isProcessing: false, success: true }));
        toast.success('Payment confirmed successfully!');
        return true;
      } else {
        throw new Error(data.error || 'Payment confirmation failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment confirmation failed';
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: errorMessage,
        success: false 
      }));
      
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    createPaymentIntent,
    confirmPayment,
    resetState,
  };
}
