// Tipos de datos para el módulo de Cuentas y Movimientos

export type Currency = 'CRC' | 'USD';
export type AccountType = 'Ahorro' | 'Corriente';
export type MovementType = 'CREDITO' | 'DEBITO';

// --- Tipos de Cuentas ---
export interface Account {
  account_id: string; // Formato IBAN: CR01-{4 banco}-{4 sucursal}-{12 cuenta}
  alias: string;      // Nombre amigable
  type: AccountType;  // Ahorro | Corriente
  currency: Currency; // CRC | USD
  balance: number;    // Saldo disponible (2 decimales)
  owner_id: string;   // customer_id del usuario
}

// --- Tipos de Movimientos ---
export interface Movement {
  id: string;            // ID de transacción
  account_id: string;    // Cuenta asociada
  date: string;          // ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
  type: MovementType;    // CREDITO | DEBITO
  description: string;   // Texto corto
  currency: Currency;    // CRC | USD
  amount: number;        // Monto del movimiento (2 decimales)
}

// --- Mock Data (Datos de prueba) ---
export const MOCK_ACCOUNTS: Account[] = [
  {
    account_id: 'CR01-0123-4567-000000000001',
    alias: 'Ahorros Principal',
    type: 'Ahorro',
    currency: 'CRC',
    balance: 1523400.50,
    owner_id: 'CUST123',
  },
  {
    account_id: 'CR01-8901-2345-000000000002',
    alias: 'Cuenta Corriente USD',
    type: 'Corriente',
    currency: 'USD',
    balance: 5432.15,
    owner_id: 'CUST123',
  },
];

export const MOCK_MOVEMENTS: Movement[] = [
  // Movimientos para Ahorros Principal (CRC)
  { id: 'T001', account_id: MOCK_ACCOUNTS[0].account_id, date: '2025-09-25T10:00:00Z', type: 'CREDITO', description: 'Depósito Nómina', currency: 'CRC', amount: 850000.00 },
  { id: 'T002', account_id: MOCK_ACCOUNTS[0].account_id, date: '2025-09-24T15:30:00Z', type: 'DEBITO', description: 'Pago Supermercado', currency: 'CRC', amount: -75500.25 },
  { id: 'T003', account_id: MOCK_ACCOUNTS[0].account_id, date: '2025-09-23T08:15:00Z', type: 'DEBITO', description: 'Pago Servicios Públicos', currency: 'CRC', amount: -50999.25 },
  // Movimientos para Cuenta Corriente USD
  { id: 'T004', account_id: MOCK_ACCOUNTS[1].account_id, date: '2025-09-25T12:00:00Z', type: 'CREDITO', description: 'Transferencia Exterior', currency: 'USD', amount: 3500.00 },
  { id: 'T005', account_id: MOCK_ACCOUNTS[1].account_id, date: '2025-09-22T18:45:00Z', type: 'DEBITO', description: 'Compra en Línea', currency: 'USD', amount: -567.85 },
];