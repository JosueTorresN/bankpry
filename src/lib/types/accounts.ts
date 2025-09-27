// lib/types/accounts.ts
export type Currency = 'CRC' | 'USD';

export type AccountType = 'Ahorros' | 'Corriente';

export interface Account {
  account_id: string;      // IBAN o número de cuenta
  alias: string;           // Nombre personalizado (ej: "Ahorros Viaje")
  type: AccountType;       // Ahorros | Corriente
  currency: Currency;      // CRC | USD
  balance: number;         // Saldo actual
}