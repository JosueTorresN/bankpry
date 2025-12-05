import axios, { AxiosError } from 'axios';
import { Account } from '@/lib/types/accounts'; 
import { ApiError } from '../types/api'; 
import { AccountsApiResponse } from '@/lib/types/accounts';

const API_BASE_URL = 'https://bank-crap-servi.onrender.com/api/v1';
const API_KEY = 'BanCrapTEC2025SecretKey!';


// interface AccountsApiResponse {
//   success: boolean;
//   timestamp: string;
//   path: string;
//   data: Array<{
//     id: string;
//     usuario_id: string;
//     iban: string;
//     alias: string;
//     tipocuenta: string; 
//     moneda: string;     
//     saldo: string;      
//     estado: string;
//     fecha_creacion: string;
//   }>;
// }

/**
 * Mapea la respuesta de la API al tipo Account local.
 * @param apiAccount Objeto de cuenta recibido de la API.
 * @returns Objeto de tipo Account.
 */
const mapApiAccountToLocal = (apiAccount: AccountsApiResponse['data'][0]): Account => {

  const currencyMap: Record<string, 'CRC' | 'USD'> = {
    '30000000-0000-0000-0000-000000000001': 'CRC', 
    '30000000-0000-0000-0000-000000000002': 'USD'
  };

  const accountTypeMap: Record<string, 'Ahorro' | 'Corriente'> = {
    '50000000-0000-0000-0000-000000000002': 'Corriente',
    '50000000-0000-0000-0000-000000000001': 'Ahorro'
  };
  console.log("Mapeando cuenta API a local:", apiAccount);
  return {
    id: apiAccount.id,
    account_id: apiAccount.iban, 
    alias: apiAccount.alias,
    type: accountTypeMap[apiAccount.tipocuenta] || 'Corriente', 
    currency: currencyMap[apiAccount.moneda] || 'CRC', 
    balance: parseFloat(apiAccount.saldo),
    owner_id: apiAccount.usuario_id,
  };
};


/**
 * Obtiene las cuentas del usuario.
 * @param token Token de autenticación Bearer.
 * @returns Un array de objetos Account.
 * @throws Un error con el mensaje de la API en caso de fallo.
 */
export async function fetchAccounts(token: string): Promise<Account[]> {
  const endpoint = `${API_BASE_URL}/accounts`;

  try {
    const response = await axios.get<AccountsApiResponse>(endpoint, {
      headers: {
        'x-api-key': API_KEY,
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    
    return response.data.data.map(mapApiAccountToLocal);
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Error de red o el servidor no respondió.';
      throw new Error(`Error al cargar cuentas: ${errorMessage}`);
    }
    throw new Error('Ha ocurrido un error inesperado al cargar las cuentas.');
  }
}