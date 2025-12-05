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