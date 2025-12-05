import { Account, Movement, ThirdPartyAccount, Currency } from '@/lib/types/accounts';

/**
 * Formatea un número como una cadena de moneda según el tipo de divisa.
 * @param amount El monto numérico a formatear.
 * @param currency El tipo de moneda ('CRC' o 'USD').
 * @returns Una cadena de texto con el formato de moneda (ej: "₡1,500.00" o "$25.50").
 */
export const formatCurrency = (amount: number, currency: Currency): string => {

  const locale = currency === 'CRC' ? 'es-CR' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};