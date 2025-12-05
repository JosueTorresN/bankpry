// lib/services/accounts.ts

import axios, { AxiosError } from 'axios';
import { Account, AccountType, Currency } from '@/lib/types/accounts'; 
import { ApiError } from '../types/api'; 
import { ApiAccountData, AccountDetailApiResponse } from '@/lib/types/accounts';

const API_BASE_URL = 'https://bank-crap-servi.onrender.com/api/v1';
const API_KEY = 'BanCrapTEC2025SecretKey!';


const currencyMap: Record<string, Currency> = {
    '30000000-0000-0000-0000-000000000002': 'CRC', 
};

const accountTypeMap: Record<string, AccountType> = {
    '50000000-0000-0000-0000-000000000001': 'Corriente', 
};

/**
 * Mapea la respuesta de la API a la interfaz Account local.
 * @param apiAccount Objeto de cuenta recibido de la API.
 * @returns Objeto de tipo Account.
 */
const mapApiAccountToLocal = (apiAccount: ApiAccountData): Account => {
  return {
    id: apiAccount.id,
    account_id: apiAccount.iban, // Usamos IBAN como account_id
    alias: apiAccount.alias,
    type: accountTypeMap[apiAccount.tipocuenta] || 'Corriente', 
    currency: currencyMap[apiAccount.moneda] || 'CRC', 
    balance: parseFloat(apiAccount.saldo),
    owner_id: apiAccount.usuario_id,
  };
};

/**
 * Obtiene los detalles de una cuenta específica por su ID.
 * @param accountId El ID de la cuenta a buscar.
 * @param token Token de autenticación Bearer.
 * @returns Un objeto Account.
 * @throws Un error con el mensaje de la API en caso de fallo.
 */
export async function fetchAccountById(accountId: string, token: string): Promise<Account> {
  const endpoint = `${API_BASE_URL}/accounts/${accountId}`;
  

  try {
    const response = await axios.get<AccountDetailApiResponse>(endpoint, {
      headers: {
        'x-api-key': API_KEY, // Requerido
        'Authorization': `Bearer ${token}`, // Requerido
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    return mapApiAccountToLocal(response.data.data);
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Error de red o el servidor no respondió.';
      throw new Error(`Error al cargar los detalles de la cuenta: ${errorMessage}`);
    }
    throw new Error('Ha ocurrido un error inesperado al cargar los detalles de la cuenta.');
  }
}