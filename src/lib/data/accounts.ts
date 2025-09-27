// lib/data/accounts.ts
import { Account, Currency } from '@/lib/types/accounts';

// Helper de formato de moneda (reutilizado)
export const formatCurrency = (amount: number, currency: Currency) => {
  const locale = currency === 'CRC' ? 'es-CR' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
};

export const MOCK_ACCOUNTS: Account[] = [
  { account_id: 'CR05015202001026284066', alias: 'Cuenta Principal', type: 'Corriente', currency: 'USD', balance: 25340.50 },
  { account_id: 'CR05015202001026284078', alias: 'Ahorros Viaje a Japón', type: 'Ahorros', currency: 'CRC', balance: 4850000.00 },
];