// lib/types/cards.ts

export type CardType = 'Gold' | 'Platinum' | 'Black';
export type Currency = 'CRC' | 'USD';

export interface CreditCard {
  id: string;
  type: CardType;
  cardNumber: string;
  exp: string;
  holder: string;
  currency: Currency;
  limit: number;
  currentBalance: number;
}