// lib/services/users.ts (Actualizado con mapeo de ID)

import axios, { AxiosError } from 'axios';
import { ApiError } from '../types/api'; 
// Importamos los tipos de valores de nuestro schema para asegurar el mapeo correcto
import { RegisterFormValues } from '@/lib/validations/registerSchema'//'../validations/registerSchema'; 

// Reutilizamos las constantes de configuración
const API_BASE_URL = 'https://bank-crap-servi.onrender.com/api/v1';
const API_KEY = 'BanCrapTEC2025SecretKey!';

// --- Tipos de Datos y Mapeo ---

// Estructura del Body que la API espera para el registro
export interface RegisterApiRequest {
    tipo_identificacion: string;
    identificacion: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono?: string;
    usuario: string;
    password: string;
    fecha_nacimiento: string;
}

// Estructura de la Respuesta de la API para el registro
interface RegisterApiResponse {
    success: boolean;
    timestamp: string;
    path: string;
    data: {
        message: string;
        userId: string;
    };
}

/**
 * Mapeo de los valores del formulario (registerSchema.ts) a los UUIDs de la API.
 * (Debes verificar y ajustar estos UUIDs con la documentación real de tu API)
 */
export const ID_TYPE_MAP: Record<RegisterFormValues['idType'], string> = {
    // El ejemplo de la API usaba este UUID para la identificación:
    'Nacional': '20000000-0000-0000-0000-000000000001', 
    'DIMEX': '20000000-0000-0000-0000-000000000002', // ID Asumido para DIMEX
    'Pasaporte': '20000000-0000-0000-0000-000000000003', // ID Asumido para Pasaporte
};


/**
 * Realiza una solicitud POST para registrar un nuevo usuario.
 * @param data Los datos del formulario ya mapeados a la estructura de la API.
 * @returns La respuesta exitosa del registro.
 * @throws Un error con el mensaje de la API en caso de fallo.
 */
export async function registerUser(data: RegisterApiRequest): Promise<RegisterApiResponse> {
  const endpoint = `${API_BASE_URL}/users`;

  try {
    const response = await axios.post<RegisterApiResponse>(endpoint, data, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Error de red o el servidor no respondió.';

      throw new Error(`Error en el registro: ${errorMessage}`);
    }
    
    throw new Error('Ha ocurrido un error inesperado al registrar el usuario.');
  }
}