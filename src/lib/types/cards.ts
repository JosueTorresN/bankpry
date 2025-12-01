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

// Respuesta cruda de la API
export interface ApiCardData {
  id: string;
  usuario_id: string;
  tipo: string; // UUID
  numero_enmascarado: string;
  fecha_expiracion: string;
  moneda: string; // UUID
  limite_credito: string; // "0.00"
  saldo_actual: string;   // "0.00"
}

export interface CardsApiResponse {
  success: boolean;
  timestamp: string;
  path: string;
  data: ApiCardData[];
}

export interface ApiCardMovementData {
  id: string;
  tarjeta_id: string; // Asumo que el backend usa 'tarjeta_id' o 'card_id'
  fecha: string;
  tipo: string;       // UUID del tipo de movimiento
  descripcion: string;
  moneda: string;     // UUID de la moneda
  monto: string;      // "150.00"
}

export interface CardMovementsApiResponse {
  success: boolean;
  data: {
    pagination: {
        totalItems: number;
        // ... otros datos de paginación
    };
    data: ApiCardMovementData[];
  };
}