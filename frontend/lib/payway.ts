import crypto from 'crypto';

interface PayWayConfig {
  merchantId: string;
  publicKey: string;
  rsaPublicKey: string;
  rsaPrivateKey: string;
  baseUrl: string;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

interface ABAPayWayPurchaseRequest {
  req_time: string;
  merchant_id: string;
  order_id: string;
  amount: number;
  currency: string;
  description: string;
  return_url: string;
  cancel_url: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  hash: string;
}

interface ABAPayWayPurchaseResponse {
  status: number;
  message: string;
  data?: {
    payment_url: string;
    transaction_id: string;
  };
}

interface TransactionDetailRequest {
  merchant_id: string;
  transaction_id: string;
  hash: string;
}

interface TransactionDetailResponse {
  status: number;
  message: string;
  data?: {
    transaction_id: string;
    order_id: string;
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
    created_at: string;
    updated_at: string;
  };
}

interface ABAPayWayTransactionResponse {
  transaction_id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

class PayWayService {
  private config: PayWayConfig;

  constructor(config: PayWayConfig) {
    this.config = config;
  }

  private generateRequestTime(): string {
    return new Date().toISOString().replace(/[:.]/g, '').slice(0, -1);
  }

  private generateHash(data: string): string {
    try {
      // Create hash using SHA-512 with the public key
      const hash = crypto.createHash('sha512');
      hash.update(data + this.config.publicKey);
      return hash.digest('hex');
    } catch (error) {
      console.error('Hash generation error:', error);
      throw new Error('Failed to generate hash');
    }
  }

  private createHashString(params: Record<string, string | number>): string {
    // Sort parameters alphabetically and create hash string
    const sortedKeys = Object.keys(params).sort();
    const hashString = sortedKeys
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return hashString;
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const reqTime = this.generateRequestTime();
      
      const purchaseData = {
        req_time: reqTime,
        merchant_id: this.config.merchantId,
        order_id: request.orderId,
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        return_url: request.returnUrl,
        cancel_url: request.cancelUrl,
        customer_name: request.customerInfo.name,
        customer_email: request.customerInfo.email,
        customer_phone: request.customerInfo.phone || '',
      };

      // Generate hash for security
      const hashString = this.createHashString(purchaseData);
      const hash = this.generateHash(hashString);

      const purchaseRequest: ABAPayWayPurchaseRequest = {
        ...purchaseData,
        items: request.items,
        hash: hash,
      };

      // Log purchase request for debugging (development only)
      if (process.env.NODE_ENV === 'development') {
        console.log('ABA PayWay Purchase Request:', {
          ...purchaseRequest,
          hash: hash.substring(0, 20) + '...' // Log partial hash for debugging
        });
      }

      const response = await fetch(`${this.config.baseUrl}/api/payment-gateway/v1/payments/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(purchaseRequest),
      });

      const responseText = await response.text();
      // Log response for debugging (development only)
      if (process.env.NODE_ENV === 'development') {
        console.log('ABA PayWay Raw Response:', responseText);
      }

      if (!response.ok) {
        throw new Error(`Payment creation failed: ${response.status} - ${responseText}`);
      }

      let data: ABAPayWayPurchaseResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      // Log parsed response for debugging (development only)
      if (process.env.NODE_ENV === 'development') {
        console.log('ABA PayWay Parsed Response:', data);
      }

      if (data.status === 200 && data.data) {
        return {
          success: true,
          paymentUrl: data.data.payment_url,
          transactionId: data.data.transaction_id,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Payment creation failed',
        };
      }
    } catch (error) {
      console.error('ABA PayWay payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment creation failed',
      };
    }
  }

  async getTransactionDetails(transactionId: string): Promise<{ success: boolean; data?: ABAPayWayTransactionResponse; error?: string }> {
    try {
      const requestData = {
        merchant_id: this.config.merchantId,
        transaction_id: transactionId,
      };

      const hashString = this.createHashString(requestData);
      const hash = this.generateHash(hashString);

      const detailRequest: TransactionDetailRequest = {
        ...requestData,
        hash: hash,
      };

      const response = await fetch(`${this.config.baseUrl}/api/payment-gateway/v1/payments/transaction-detail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(detailRequest),
      });

      if (!response.ok) {
        throw new Error(`Transaction detail fetch failed: ${response.statusText}`);
      }

      const data: TransactionDetailResponse = await response.json();
      
      if (data.status === 200 && data.data) {
        return {
          success: true,
          data: data.data,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Transaction detail fetch failed',
        };
      }
    } catch (error) {
      console.error('ABA PayWay transaction detail error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction detail fetch failed',
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<{ success: boolean; status: string; error?: string }> {
    try {
      const detailResponse = await this.getTransactionDetails(transactionId);
      
      if (detailResponse.success && detailResponse.data) {
        return {
          success: true,
          status: detailResponse.data.status,
        };
      } else {
        return {
          success: false,
          status: 'error',
          error: detailResponse.error || 'Payment verification failed',
        };
      }
    } catch (error) {
      console.error('ABA PayWay payment verification error:', error);
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Payment verification failed',
      };
    }
  }

  async checkTransaction(transactionId: string): Promise<{ success: boolean; data?: ABAPayWayTransactionResponse; error?: string }> {
    try {
      const requestData = {
        merchant_id: this.config.merchantId,
        transaction_id: transactionId,
      };

      const hashString = this.createHashString(requestData);
      const hash = this.generateHash(hashString);

      const checkRequest = {
        ...requestData,
        hash: hash,
      };

      const response = await fetch(`${this.config.baseUrl}/api/payment-gateway/v1/payments/check-transaction-2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(checkRequest),
      });

      if (!response.ok) {
        throw new Error(`Transaction check failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 200) {
        return {
          success: true,
          data: data.data,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Transaction check failed',
        };
      }
    } catch (error) {
      console.error('ABA PayWay transaction check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction check failed',
      };
    }
  }

  async closeTransaction(transactionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const requestData = {
        merchant_id: this.config.merchantId,
        transaction_id: transactionId,
      };

      const hashString = this.createHashString(requestData);
      const hash = this.generateHash(hashString);

      const closeRequest = {
        ...requestData,
        hash: hash,
      };

      const response = await fetch(`${this.config.baseUrl}/api/payment-gateway/v1/payments/close-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(closeRequest),
      });

      if (!response.ok) {
        throw new Error(`Transaction close failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 200) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Transaction close failed',
        };
      }
    } catch (error) {
      console.error('ABA PayWay transaction close error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction close failed',
      };
    }
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<{ success: boolean; rate?: number; error?: string }> {
    try {
      const requestData = {
        from_currency: fromCurrency,
        to_currency: toCurrency,
      };

      const hashString = this.createHashString(requestData);
      const hash = this.generateHash(hashString);

      const exchangeRequest = {
        ...requestData,
        hash: hash,
      };

      const response = await fetch(`${this.config.baseUrl}/api/payment-gateway/v1/exchange-rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(exchangeRequest),
      });

      if (!response.ok) {
        throw new Error(`Exchange rate fetch failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 200 && data.data) {
        return {
          success: true,
          rate: data.data.rate,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Exchange rate fetch failed',
        };
      }
    } catch (error) {
      console.error('ABA PayWay exchange rate error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Exchange rate fetch failed',
      };
    }
  }

  // Mock payment for demo purposes (fallback)
  async createMockPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock payment URL
    const mockTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockPaymentUrl = `${this.config.baseUrl}/payment/${mockTransactionId}?amount=${request.amount}&currency=${request.currency}`;

    return {
      success: true,
      paymentUrl: mockPaymentUrl,
      transactionId: mockTransactionId,
    };
  }
}

// Initialize PayWay service with ABA PayWay configuration
export const payWayService = new PayWayService({
  merchantId: process.env.NEXT_PUBLIC_ABA_PAYWAY_MERCHANT_ID!,
  publicKey: process.env.NEXT_PUBLIC_ABA_PAYWAY_PUBLIC_KEY!,
  rsaPublicKey: process.env.NEXT_PUBLIC_ABA_PAYWAY_RSA_PUBLIC_KEY!,
  rsaPrivateKey: process.env.NEXT_PUBLIC_ABA_PAYWAY_RSA_PRIVATE_KEY!,
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://checkout.payway.com.kh' 
    : 'https://checkout-sandbox.payway.com.kh',
});

export type { PaymentRequest, PaymentResponse };