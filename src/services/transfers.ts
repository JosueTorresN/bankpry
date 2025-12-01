// lib/services/transfers.ts
import axios, { AxiosError } from 'axios';
import { TransferFormValues } from '@/lib/validations/transferSchema';
import { ApiError } from '@/types/api'; 

const API_BASE_URL = 'https://bank-crap-servi.onrender.com/api/v1';
const API_KEY = 'BANK-CENTRAL-IC8057-2025'; 

// Mapa para convertir tu moneda local (CRC) al UUID que pide el backend
const currencyToUuidMap: Record<string, string> = {
    'CRC': '50000000-0000-0000-0000-000000000002',
    'USD': '30000000-0000-0000-0000-000000000002', // Asumiendo UUID para USD (ajustar si es diferente)
};

export interface InternalTransferResponse {
    transfer_id: string;
    receipt_number: string;
    status: string;
}

/**
 * Realiza una transferencia interna entre cuentas propias.
 */
export async function performInternalTransfer(data: TransferFormValues, currencyCode: string, token: string): Promise<InternalTransferResponse> {
    const endpoint = `${API_BASE_URL}/transfers/internal`;
    
    // Convertimos la moneda visual (CRC) al UUID técnico
    const currencyUuid = currencyToUuidMap[currencyCode] || currencyToUuidMap['CRC'];

    // Preparamos el payload exacto que pide el backend
    const payload = {
        fromAccountId: data.sourceAccountId,
        toAccountId: data.targetAccountId,
        amount: data.amount, // Asumimos que ya es número
        currency: currencyUuid,
        description: data.description || 'Transferencia interna'
    };

    try {
        const response = await axios.post<{ data: InternalTransferResponse }>(endpoint, payload, {
            headers: {
                'X-API-TOKEN': API_KEY,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
             // Extraemos el mensaje de error del backend si existe
             const axiosError = error as AxiosError<ApiError>;
             throw new Error(axiosError.response?.data?.message || 'Error al procesar la transferencia.');
        }
        throw new Error('Error de conexión al realizar la transferencia.');
    }
}