'use client';

export type Currency = 'USD' | 'KHR';

export const EXCHANGE_RATE = 4100; // 1 USD = 4100 KHR (approximate)

export function formatPrice(price: { usd: number; khr: number }, currency: Currency = 'USD'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.usd);
  } else {
    return new Intl.NumberFormat('km-KH', {
      style: 'currency',
      currency: 'KHR',
      minimumFractionDigits: 0,
    }).format(price.khr);
  }
}

export function convertPrice(amount: number, fromCurrency: Currency, toCurrency: Currency): number {
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === 'USD' && toCurrency === 'KHR') {
    return Math.round(amount * EXCHANGE_RATE);
  }
  
  if (fromCurrency === 'KHR' && toCurrency === 'USD') {
    return Math.round((amount / EXCHANGE_RATE) * 100) / 100;
  }
  
  return amount;
}

export function getPriceInCurrency(price: { usd: number; khr: number }, currency: Currency): number {
  return currency === 'USD' ? price.usd : price.khr;
}