// lib/types/cards.ts

export type CardType = 'Gold' | 'Platinum' | 'Black';
export type Currency = 'CRC' | 'USD';
export type MovementType = 'CREDITO' | 'DEBITO';
export type CardMovementType = 'COMPRA' | 'PAGO';

export interface CreditCard {
  id: string;
  type: CardType;
  cardNumber: string;
  exp: string;
  holder: string;
  currency: Currency;
  limit: number;
  currentBalance: number;
  pin: string;
  cvv: string;
}

// --- Tipos de Movimientos de Tarjeta ---
export interface CardMovement {
  id: string;             // ID de transacción
  card_id: string;        // Tarjeta asociada
  date: string;           // ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
  type: CardMovementType; // COMPRA | PAGO
  description: string;    // Texto corto
  currency: Currency;     // CRC | USD
  amount: number;         // Monto del movimiento (2 decimales)
}

// Helper para enmascarar el número de tarjeta (1234 **** **** 1234)
export const maskCardNumber = (cardNumber: string) => {
  if (cardNumber.length < 16) return cardNumber;
  const first = cardNumber.substring(0, 4);
  const last = cardNumber.substring(12, 16);
  return `${first} **** **** ${last}`;
};