import { CurrencyCode, CurrencyInfo } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    rateAgainstINR: 1,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rateAgainstINR: 86.5,
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    rateAgainstINR: 23.55,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    rateAgainstINR: 111.2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rateAgainstINR: 93.8,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    rateAgainstINR: 64.9,
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    rateAgainstINR: 61.4,
  },
};

export function convertFromINR(amountInINR: number, targetCurrency: CurrencyCode): number {
  const currency = CURRENCIES[targetCurrency] || CURRENCIES.INR;
  return amountInINR / currency.rateAgainstINR;
}

export function formatCurrency(amountInINR: number, targetCurrency: CurrencyCode = 'INR'): string {
  const currency = CURRENCIES[targetCurrency] || CURRENCIES.INR;
  const converted = convertFromINR(amountInINR, targetCurrency);

  if (targetCurrency === 'INR') {
    if (amountInINR >= 10000000) {
      return `₹${(amountInINR / 10000000).toFixed(2)} Cr`;
    }
    if (amountInINR >= 100000) {
      return `₹${(amountInINR / 100000).toFixed(2)} Lakh`;
    }
    return `₹${Math.round(amountInINR).toLocaleString('en-IN')}`;
  }

  // International formats
  if (converted >= 1000000) {
    return `${currency.symbol}${(converted / 1000000).toFixed(2)}M`;
  }
  if (converted >= 1000) {
    return `${currency.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  }
  return `${currency.symbol}${converted.toFixed(0)}`;
}

export function formatRatePerSqFt(rateInINR: number, targetCurrency: CurrencyCode = 'INR'): string {
  const currency = CURRENCIES[targetCurrency] || CURRENCIES.INR;
  const converted = convertFromINR(rateInINR, targetCurrency);
  if (targetCurrency === 'INR') {
    return `₹${Math.round(rateInINR).toLocaleString('en-IN')}/sq.ft`;
  }
  return `${currency.symbol}${converted.toFixed(2)}/sq.ft`;
}
