import { Account, Movement, ThirdPartyAccount, Currency } from '@/lib/types/accounts';


// --- AÑADE ESTA FUNCIÓN AQUÍ ---
/**
 * Formatea un número como una cadena de moneda según el tipo de divisa.
 * @param amount El monto numérico a formatear.
 * @param currency El tipo de moneda ('CRC' o 'USD').
 * @returns Una cadena de texto con el formato de moneda (ej: "₡1,500.00" o "$25.50").
 */
export const formatCurrency = (amount: number, currency: Currency): string => {
  // Determina la configuración regional (locale) basada en la moneda.
  // 'es-CR' para colones de Costa Rica, 'en-US' para dólares de EE.UU.
  const locale = currency === 'CRC' ? 'es-CR' : 'en-US';

  // Usa la API de Internacionalización de JavaScript para un formato correcto y nativo.
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

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
  // CUENTA NUEVA 3: Colones Adicional
  {
    account_id: 'CR01-1111-2222-000000000003',
    alias: 'Ahorros para Viaje',
    type: 'Ahorro',
    currency: 'CRC',
    balance: 750000.00,
    owner_id: 'CUST123',
  },
  // CUENTA NUEVA 4: Dólares Adicional
  {
    account_id: 'CR01-3333-4444-000000000004',
    alias: 'Fondo de Emergencia USD',
    type: 'Ahorro',
    currency: 'USD',
    balance: 1200.00,
    owner_id: 'CUST123',
  },
];


// SIMULACIÓN DE TERCEROS REGISTRADOS (Mismo banco)
export const MOCK_THIRD_PARTIES: ThirdPartyAccount[] = [
  { account_id: '12345678901234567890', owner_name: 'Maria Rojas Pérez', bank_name: 'Tu Banco Digital' },
  { account_id: '24681012141618202224', owner_name: 'Carlos Soto Mora', bank_name: 'Tu Banco Digital' },
];

// SIMULACIÓN DE FUNCIÓN DE VALIDACIÓN DE CUENTA DE TERCEROS
// (En un entorno real, esto sería una llamada a la API)
export const findThirdPartyOwner = (accountId: string): ThirdPartyAccount | undefined => {
  return MOCK_THIRD_PARTIES.find(p => p.account_id === accountId);
};

export const MOCK_MOVEMENTS: Movement[] = [
  // Movimientos para Ahorros Principal (CRC - Cuenta 1)
  { id: 'T001', account_id: MOCK_ACCOUNTS[0].account_id, date: '2025-09-25T10:00:00Z', type: 'CREDITO', description: 'Depósito Nómina', currency: 'CRC', amount: 850000.00 },
  { id: 'T002', account_id: MOCK_ACCOUNTS[0].account_id, date: '2025-09-24T15:30:00Z', type: 'DEBITO', description: 'Pago Supermercado', currency: 'CRC', amount: -75500.25 },
  { id: 'T003', account_id: MOCK_ACCOUNTS[0].account_id, date: '2025-09-23T08:15:00Z', type: 'DEBITO', description: 'Pago Servicios Públicos', currency: 'CRC', amount: -50999.25 },
  
  // Movimientos para Cuenta Corriente USD (Cuenta 2)
  { id: 'T004', account_id: MOCK_ACCOUNTS[1].account_id, date: '2025-09-25T12:00:00Z', type: 'CREDITO', description: 'Transferencia Exterior', currency: 'USD', amount: 3500.00 },
  { id: 'T005', account_id: MOCK_ACCOUNTS[1].account_id, date: '2025-09-22T18:45:00Z', type: 'DEBITO', description: 'Compra en Línea', currency: 'USD', amount: -567.85 },

  // Movimientos para Ahorros para Viaje (CRC - Cuenta 3 NUEVA)
  { id: 'T006', account_id: MOCK_ACCOUNTS[2].account_id, date: '2025-09-26T14:00:00Z', type: 'CREDITO', description: 'Aporte Ahorro Mensual', currency: 'CRC', amount: 150000.00 },
  
  // Movimientos para Fondo de Emergencia USD (Cuenta 4 NUEVA)
  { id: 'T007', account_id: MOCK_ACCOUNTS[3].account_id, date: '2025-09-26T16:00:00Z', type: 'CREDITO', description: 'Depósito Inicial', currency: 'USD', amount: 1200.00 },
];
// export const MOCK_MOVEMENTS: Movement[] = [
//   // Movimientos para Ahorros Principal (CRC)
//   { id: 'T001', account_id: MOCK_ACCOUNTS[0].account_id, date: '2025-09-25T10:00:00Z', type: 'CREDITO', description: 'Depósito Nómina', currency: 'CRC', amount: 850000.00 },
//   { id: 'T002', account_id: MOCK_ACCOUNTS[0].account_id, date: '2025-09-24T15:30:00Z', type: 'DEBITO', description: 'Pago Supermercado', currency: 'CRC', amount: -75500.25 },
//   { id: 'T003', account_id: MOCK_ACCOUNTS[0].account_id, date: '2025-09-23T08:15:00Z', type: 'DEBITO', description: 'Pago Servicios Públicos', currency: 'CRC', amount: -50999.25 },
//   // Movimientos para Cuenta Corriente USD
//   { id: 'T004', account_id: MOCK_ACCOUNTS[1].account_id, date: '2025-09-25T12:00:00Z', type: 'CREDITO', description: 'Transferencia Exterior', currency: 'USD', amount: 3500.00 },
//   { id: 'T005', account_id: MOCK_ACCOUNTS[1].account_id, date: '2025-09-22T18:45:00Z', type: 'DEBITO', description: 'Compra en Línea', currency: 'USD', amount: -567.85 },
// ];