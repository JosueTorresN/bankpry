// Tipos de datos para el módulo de Tarjetas de Crédito

export type CardType = 'Gold' | 'Platinum' | 'Black';
export type Currency = 'CRC' | 'USD';
export type CardMovementType = 'COMPRA' | 'PAGO';

// --- Tipos de Tarjetas de Crédito ---
export interface CreditCard {
  id: string;             // ID único
  type: CardType;         // Gold | Platinum | Black
  cardNumber: string;     // Número completo de la tarjeta (para usar enmascarado)
  exp: string;            // Fecha de vencimiento MM/AA
  pin: string;            // PIN (simulado, nunca se enviaría al frontend en un sistema real)
  cvv: string;            // CVV (simulado)
  holder: string;         // Nombre del titular
  currency: Currency;     // CRC | USD
  limit: number;          // Límite total de crédito
  currentBalance: number; // Consumo actual (saldo utilizado)
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

// --- Mock Data (Datos de prueba) ---

// Helper para enmascarar el número de tarjeta (1234 **** **** 1234)
export const maskCardNumber = (cardNumber: string) => {
  if (cardNumber.length < 16) return cardNumber;
  const first = cardNumber.substring(0, 4);
  const last = cardNumber.substring(12, 16);
  return `${first} **** **** ${last}`;
};

export const MOCK_CARDS: CreditCard[] = [
  {
    id: 'CC001',
    type: 'Platinum',
    cardNumber: '4567890123456789',
    exp: '12/26',
    pin: '1234',
    cvv: '123',
    holder: 'JOHN DOE',
    currency: 'USD',
    limit: 15000.00,
    currentBalance: 4500.50,
  },
  {
    id: 'CC002',
    type: 'Gold',
    cardNumber: '4111222233334444',
    exp: '07/28',
    pin: '5678',
    cvv: '456',
    holder: 'JOHN DOE',
    currency: 'CRC',
    limit: 3000000.00,
    currentBalance: 850750.00,
  },
];

export const MOCK_CARD_MOVEMENTS: CardMovement[] = [
  // Movimientos para Tarjeta Platinum (USD) - CC001
  { id: 'CM001', card_id: 'CC001', date: '2025-09-25T14:20:00Z', type: 'COMPRA', description: 'Amazon Web Services', currency: 'USD', amount: 55.99 },
  { id: 'CM002', card_id: 'CC001', date: '2025-09-24T10:00:00Z', type: 'COMPRA', description: 'Viaje a Miami (Aéreo)', currency: 'USD', amount: 1200.00 },
  { id: 'CM003', card_id: 'CC001', date: '2025-09-20T09:30:00Z', type: 'PAGO', description: 'Pago Mínimo Tarjeta', currency: 'USD', amount: -250.00 },
  // Movimientos para Tarjeta Gold (CRC) - CC002
  { id: 'CM004', card_id: 'CC002', date: '2025-09-26T18:00:00Z', type: 'COMPRA', description: 'Restaurante Local', currency: 'CRC', amount: 45500.00 },
  { id: 'CM005', card_id: 'CC002', date: '2025-09-25T11:45:00Z', type: 'COMPRA', description: 'Farmacia La Central', currency: 'CRC', amount: 8750.50 },
  { id: 'CM006', card_id: 'CC002', date: '2025-09-23T15:00:00Z', type: 'PAGO', description: 'Pago Total Factura', currency: 'CRC', amount: -150000.00 },
];