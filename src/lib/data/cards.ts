// lib/data/cards.ts
import { CreditCard, Currency, CardMovement } from '@/lib/types/cards';

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