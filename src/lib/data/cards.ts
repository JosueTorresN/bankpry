// lib/data/cards.ts
import { CreditCard, Currency } from '@/lib/types/cards';

export const formatCurrency = (amount: number, currency: Currency) => {
  const locale = currency === 'CRC' ? 'es-CR' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
};

export const maskCardNumber = (cardNumber: string) => {
  return cardNumber.slice(0, 4) + ' **** **** ' + cardNumber.slice(-4);
};

export const MOCK_CARDS: CreditCard[] = [
  { id: 'CC001', type: 'Platinum', cardNumber: '4567890123456789', exp: '12/26', holder: 'JOHN DOE', currency: 'USD', limit: 15000.00, currentBalance: 4500.50 },
  { id: 'CC002', type: 'Gold', cardNumber: '4111222233334444', exp: '07/28', holder: 'JOHN DOE', currency: 'CRC', limit: 3000000.00, currentBalance: 850750.00 },
];