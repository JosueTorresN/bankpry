/**
 * Interfaz para el cuerpo (body) de la solicitud de login.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Interfaz para la respuesta exitosa del servidor después del login.
 * (Ajusta esto a la respuesta real de tu API)
 */
export interface LoginResponse {
  data: {
    token: string;
  };
  user_id: number;
}

/**
 * Interfaz para el formato de un error de la API.
 * (Ajusta esto a la respuesta de error real de tu API)
 */
export interface ApiError {
  message: string;
  code: string;
  // ...
}


export interface RegisterResponse {
    user_id: string; // El ID del nuevo usuario
    message: string;
    // ... otros campos
}

export type MovementType = 'CREDITO' | 'DEBITO' | 'TODOS';

// Interfaces para la respuesta de la API de Movimientos
export interface ApiMovementData {
  id: string;
  cuenta_id: string;
  fecha: string;
  tipo: string; // UUID
  descripcion: string;
  moneda: string; // UUID
  monto: string; // Viene como string "150.75"
}

export interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface MovementApiResponse {
  success: boolean;
  timestamp: string;
  path: string;
  data: {
    pagination: PaginationData;
    data: ApiMovementData[];
  };
}