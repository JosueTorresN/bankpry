// lib/services/cards.ts
import axios, { AxiosError } from 'axios';
import { CreditCard, CardType, Currency, CardsApiResponse, ApiCardData, CardMovementType, ApiCardMovementData, CardMovement, CardMovementsApiResponse } from '@/lib/types/cards';
import { ApiError } from '@/types/api'; // Asumo que tienes este tipo común

const API_BASE_URL = 'https://bank-crap-servi.onrender.com/api/v1';
const API_KEY = 'BanCrapTEC2025SecretKey!'; 

// Mapas de UUIDs (Ajustables según documentación del backend)
const cardTypeMap: Record<string, CardType> = {
    '80000000-0000-0000-0000-000000000001': 'Gold',
    '80000000-0000-0000-0000-000000000002': 'Platinum', // El que sale en tu ejemplo
    '80000000-0000-0000-0000-000000000003': 'Black',
};

const currencyMap: Record<string, Currency> = {
    '50000000-0000-0000-0000-000000000002': 'CRC',
    '30000000-0000-0000-0000-000000000002': 'USD'
};

// UUIDs para movimientos (COMPRA vs PAGO)
const movementTypeMap: Record<string, CardMovementType> = {
    '90000000-0000-0000-0000-000000000001': 'COMPRA', // <--- REEMPLAZAR CON UUID REAL
    '90000000-0000-0000-0000-000000000002': 'PAGO',   // <--- REEMPLAZAR CON UUID REAL
};

export interface OtpResponse {
    message: string;
}

export interface SensitiveDataResponse {
    message: string;
    pin: string;
    cvv: string;
}

/**
 * Mapea la data cruda de la API a la interfaz CreditCard de la UI
 */
const mapApiCardToLocal = (apiCard: ApiCardData): CreditCard => {
  return {
    id: apiCard.id,
    type: cardTypeMap[apiCard.tipo] || 'Gold', // Fallback
    cardNumber: apiCard.numero_enmascarado, // Usamos la enmascarada directamente
    exp: apiCard.fecha_expiracion,
    holder: 'USUARIO ACTUAL', // La API no devuelve el nombre, usar placeholder o info del user context
    currency: currencyMap[apiCard.moneda] || 'CRC',
    limit: parseFloat(apiCard.limite_credito),
    currentBalance: parseFloat(apiCard.saldo_actual),
    pin: '****', // Dato sensible no retornado por API lista
    cvv: '***',  // Dato sensible no retornado por API lista
  };
};

const mapApiMovementToLocal = (apiMov: ApiCardMovementData): CardMovement => {
    return {
        id: apiMov.id,
        card_id: apiMov.tarjeta_id,
        date: apiMov.fecha,
        description: apiMov.descripcion,
        type: movementTypeMap[apiMov.tipo] || 'COMPRA', // Default fallback
        currency: currencyMap[apiMov.moneda] || 'CRC',
        amount: parseFloat(apiMov.monto),
    };
};

/**
 * Obtiene las tarjetas del usuario logueado
 */
export async function fetchCards(token: string): Promise<CreditCard[]> {
  const endpoint = `${API_BASE_URL}/cards/`;

  try {
    const response = await axios.get<CardsApiResponse>(endpoint, {
      headers: {
        'x-api-key': API_KEY,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.data.map(mapApiCardToLocal);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Error al cargar tarjetas.');
    }
    throw new Error('Error inesperado al conectar con el servidor de tarjetas.');
  }
}

// 1. Obtener una tarjeta específica por ID
export async function fetchCardById(cardId: string, token: string): Promise<CreditCard> {
    // Si la API no tiene endpoint individual, podríamos llamar a fetchCards y filtrar, 
    // pero asumiremos que existe /cards/{id}
    const endpoint = `${API_BASE_URL}/cards/${cardId}`; 
    try {
        const response = await axios.get<{ data: ApiCardData }>(endpoint, { // Ajustar estructura si varía
            headers: {
                'x-api-key': API_KEY,
                'Authorization': `Bearer ${token}`,
            }
        });
        // Nota: A veces la API devuelve array en data, a veces objeto. Ajustar según respuesta real.
        // Asumiendo que devuelve el objeto directo o dentro de data.data:
        return mapApiCardToLocal(response.data.data); 
    } catch (error) {
        throw new Error('Error al cargar la tarjeta.');
    }
}

// 2. Obtener movimientos de la tarjeta
export async function fetchCardMovements(cardId: string, token: string): Promise<CardMovement[]> {
    const endpoint = `${API_BASE_URL}/cards/${cardId}/movements`;
    try {
        const response = await axios.get<CardMovementsApiResponse>(endpoint, {
            headers: {
                'x-api-key': API_KEY,
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data.data.data.map(mapApiMovementToLocal);
    } catch (error) {
        console.error("Error fetching card movements:", error);
        throw new Error('Error al cargar movimientos de la tarjeta.');
    }
}

/**
 * Solicita el envío de un código OTP para ver el PIN
 */
export async function requestCardOtp(cardId: string, token: string): Promise<string> {
    const endpoint = `${API_BASE_URL}/cards/${cardId}/otp`;
    
    try {
        // Es un POST, aunque no lleve body, axios espera un segundo argumento (body)
        const response = await axios.post<{ data: OtpResponse }>(endpoint, {}, {
            headers: {
                'x-api-key': API_KEY,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        
        return response.data.data.message;
    } catch (error) {
        if (axios.isAxiosError(error)) {
             throw new Error(error.response?.data?.message || 'Error al solicitar el OTP.');
        }
        throw new Error('Error de conexión al solicitar el código.');
    }
}

/**
 * Valida el OTP y obtiene los datos sensibles (PIN/CVV)
 * Endpoint: POST /cards/{cardId}/view-details
 */
export async function verifyCardOtp(cardId: string, otpCode: string, token: string): Promise<SensitiveDataResponse> {
    // Basado en el "path" del JSON de respuesta, la URL usa el cardId
    const endpoint = `${API_BASE_URL}/cards/${cardId}/view-details`;
    
    try {
        // Enviamos el OTP en el body. 
        // Nota: Asumo que el backend espera { "code": "..." } o { "otp": "..." }.
        // Usaré "code" que es estándar, si falla prueba con "otp".
        const body = { otp: otpCode }; 

        const response = await axios.post<{ data: SensitiveDataResponse }>(endpoint, body, {
            headers: {
                'x-api-key': API_KEY,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
             throw new Error(error.response?.data?.message || 'El código OTP es incorrecto o ha expirado.');
        }
        throw new Error('Error al validar el código.');
    }
}