// lib/services/movements.ts
import axios, { AxiosError } from 'axios';
import { Movement, Currency, MovementType } from '@/lib/types/accounts';
import { ApiError } from '../types/api';
import { MovementApiResponse, ApiMovementData } from '@/types/api';

const API_BASE_URL = 'https://bank-crap-servi.onrender.com/api/v1';
const API_KEY = 'BanCrapTEC2025SecretKey!'; 


const movementTypeMap: Record<string, MovementType> = {
    '60000000-0000-0000-0000-000000000002': 'DEBITO', 

    '60000000-0000-0000-0000-000000000001': 'CREDITO'
};


const currencyMap: Record<string, Currency> = {
    '50000000-0000-0000-0000-000000000002': 'CRC',
    '30000000-0000-0000-0000-000000000002': 'USD'
};

/**
 * Transforma el movimiento de la API al modelo local de la UI.
 */
const mapApiMovementToLocal = (apiMovement: ApiMovementData): Movement => {
    const type = movementTypeMap[apiMovement.tipo] || 'CREDITO';
    const currency = currencyMap[apiMovement.moneda] || 'CRC';
    
    let amount = parseFloat(apiMovement.monto);


    return {
        account_id: apiMovement.cuenta_id,
        id: apiMovement.id,
        date: apiMovement.fecha,
        description: apiMovement.descripcion,
        amount: amount,
        currency: currency,
        type: type,
    };
};

/**
 * Obtiene los movimientos de una cuenta.
 * @param accountId ID de la cuenta (UUID).
 * @param token Token Bearer del usuario autenticado.
 */
export async function fetchAccountMovements(accountId: string, token: string): Promise<Movement[]> {
    const endpoint = `${API_BASE_URL}/accounts/${accountId}/movements`;

    try {
        const response = await axios.get<MovementApiResponse>(endpoint, {
            headers: {
                'x-api-key': API_KEY,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            validateStatus: (status) => status >= 200 && status < 300,
        });

        return response.data.data.data.map(mapApiMovementToLocal);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiError>;
            const errorMessage =
                axiosError.response?.data?.message ||
                axiosError.message ||
                'Error al obtener los movimientos.';
            throw new Error(errorMessage);
        }
        throw new Error('Error inesperado al cargar movimientos.');
    }
}