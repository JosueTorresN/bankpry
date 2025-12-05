// lib/services/transfers.ts
import axios, { AxiosError } from 'axios';
import { TransferFormValues } from '@/lib/validations/transferSchema';
import { ApiError } from '@/types/api'; 

const API_BASE_URL = 'https://bank-crap-servi.onrender.com/api/v1';
const API_KEY = 'BanCrapTEC2025SecretKey!'//'BANK-CENTRAL-IC8057-2025';
const API_TOKEN_HEADER = 'BANK-CENTRAL-IC8057-2025';

// Mapa para convertir tu moneda local (CRC) al UUID que pide el backend
const currencyToUuidMap: Record<string, string> = {
    'CRC': '30000000-0000-0000-0000-000000000001',
    'USD': '30000000-0000-0000-0000-000000000002',
};

export interface InternalTransferResponse {
    transfer_id: string;
    receipt_number: string;
    status: string;
}

export interface TransferResponse {
    transfer_id: string;
    receipt_number: string;
    status: string;
}

interface ValidateAccountResponse {
    exists: boolean;
    info: {
        name: string;
        identification: string;
        currency: string;
        debit: boolean;
        credit: boolean;
    } | null;
}

/**
 * Realiza una transferencia interna entre cuentas propias.
 */
export async function performInternalTransfer(data: TransferFormValues, currencyCode: string, token: string): Promise<InternalTransferResponse> {
    const endpoint = `${API_BASE_URL}/transfers/internal`;
    
    const currencyUuid = currencyToUuidMap[currencyCode] || currencyToUuidMap['CRC'];


    const payload = {
        fromAccountId: data.sourceAccountId,
        toAccountId: data.targetAccountId,   
        amount: data.amount,
        currency: currencyUuid,
        description: data.description || 'Transferencia interna'
    };
    try {
        const response = await axios.post<{ data: InternalTransferResponse }>(endpoint, payload, {
            headers: {
                'x-api-key': API_KEY,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
             const axiosError = error as AxiosError<ApiError>;
             throw new Error(axiosError.response?.data?.message || 'Error al procesar la transferencia.');
        }
        throw new Error('Error de conexión al realizar la transferencia.');
    }
}

export async function performInterbankTransfer(data: TransferFormValues, currencyCode: string, token: string): Promise<TransferResponse> {
    console.log("Iniciando transferencia INTERBANCARIA (Terceros)");
    const endpoint = `${API_BASE_URL}/transfers/interbank`; //
    
    const currencyUuid = currencyToUuidMap[currencyCode] || currencyToUuidMap['CRC'];

    // Payload para Interbancaria
    const payload = {
        fromAccountId: data.sourceAccountId,
        toAccountId: data.targetAccountId,  
        targetName: data.targetOwner,   
        amount: data.amount,
        currency: currencyUuid,
        description: data.description || 'Transferencia a terceros'
    };

    return await executeTransfer(endpoint, payload, token);
}

async function executeTransfer(endpoint: string, payload: any, token: string): Promise<TransferResponse> {
    try {
        const response = await axios.post<{ data: TransferResponse }>(endpoint, payload, {
            headers: {
                'x-api-key': API_KEY,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
             const axiosError = error as AxiosError<ApiError>;
             throw new Error(axiosError.response?.data?.message || 'Error al procesar la transferencia.');
        }
        throw new Error('Error de conexión al realizar la transferencia.');
    }
}

export async function validateExternalAccount(iban: string, token: string): Promise<string> {
    const endpoint = `${API_BASE_URL}/bank/validate-account`;

    try {
        const response = await axios.post<ValidateAccountResponse>(endpoint, { iban }, {
            headers: {
                'X-API-TOKEN': API_TOKEN_HEADER,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        const data = response.data;

        // 1. Verificamos si la bandera 'exists' es true [cite: 100]
        if (!data.exists || !data.info) {
             throw new Error('La cuenta no existe en el banco destino.');
        }

        // 2. Retornamos el nombre que está dentro del objeto 'info' [cite: 111]
        return data.info.name;

    } catch (error) {
        if (axios.isAxiosError(error)) {
             // Si el backend responde 400 (Bad Request) por formato inválido
             const errorMessage = error.response?.data?.message || 'Error al validar la cuenta.';
             throw new Error(errorMessage);
        }
        throw new Error('Error de conexión al validar la cuenta.');
    }
}