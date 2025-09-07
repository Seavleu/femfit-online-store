// Exchange rate utility for USD/KHR conversion
// In production, you might want to fetch real-time rates from an API

const EXCHANGE_RATES = {
  USD_TO_KHR: 4100, // Approximate rate
  KHR_TO_USD: 1 / 4100
};

const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  if (from === 'USD' && to === 'KHR') {
    return Math.round(amount * EXCHANGE_RATES.USD_TO_KHR);
  }

  if (from === 'KHR' && to === 'USD') {
    return Math.round(amount * EXCHANGE_RATES.KHR_TO_USD * 100) / 100; // Round to 2 decimal places
  }

  throw new Error(`Unsupported currency conversion: ${from} to ${to}`);
};

const formatCurrency = (amount, currency) => {
  const curr = currency.toUpperCase();
  
  if (curr === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  if (curr === 'KHR') {
    return new Intl.NumberFormat('km-KH', {
      style: 'currency',
      currency: 'KHR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  return amount.toString();
};

module.exports = {
  EXCHANGE_RATES,
  convertCurrency,
  formatCurrency
};