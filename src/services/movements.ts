// lib/services/movements.ts
import axios, { AxiosError } from 'axios';
import { Movement, Currency, MovementType } from '@/lib/types/accounts';
import { ApiError } from '../types/api';
import { MovementApiResponse, ApiMovementData } from '@/types/api';

const API_BASE_URL = 'https://bank-crap-servi.onrender.com/api/v1';
const API_KEY = 'BanCrapTEC2025SecretKey!'; // Idealmente, mueve esto a process.env.NEXT_PUBLIC_API_KEY

// Mapa de UUIDs a Tipos locales (Ajustar según documentación real del backend)
const movementTypeMap: Record<string, MovementType> = {
    '60000000-0000-0000-0000-000000000002': 'DEBITO', 
    // AGREGAR AQUÍ EL UUID DE DÉBITO CUANDO LO TENGAS:
    '60000000-0000-0000-0000-000000000001': 'CREDITO'
};

// Reutilizamos el mapa de monedas si es consistente con accounts.ts
const currencyMap: Record<string, Currency> = {
    '50000000-0000-0000-0000-000000000002': 'CRC',
    '30000000-0000-0000-0000-000000000002': 'USD'
};

/**
 * Transforma el movimiento de la API al modelo local de la UI.
 */
const mapApiMovementToLocal = (apiMovement: ApiMovementData): Movement => {
    const type = movementTypeMap[apiMovement.tipo] || 'CREDITO'; // Fallback por seguridad
    const currency = currencyMap[apiMovement.moneda] || 'CRC';
    
    // Convertir monto a número. 
    // IMPORTANTE: Si es DEBITO, la UI suele esperarlo negativo o manejarlo con el tipo.
    // Tu componente MovementList usa Math.abs(), así que el signo aquí es informativo.
    let amount = parseFloat(apiMovement.monto);
    
    // Opcional: Si quieres guardar el valor negativo para débitos explícitamente:
    // if (type === 'DEBITO') amount = -Math.abs(amount);

    return {
        account_id: apiMovement.cuenta_id,
        id: apiMovement.id,
        date: apiMovement.fecha, // Se mantiene formato ISO
        description: apiMovement.descripcion,
        amount: amount,
        currency: currency,
        type: type,
        // Agrega otros campos si tu interfaz Movement local los requiere
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

        // Mapeamos el array de 'data.data'
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