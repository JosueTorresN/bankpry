

import axios, { AxiosError } from 'axios';
import { LoginRequest, LoginResponse, ApiError } from '../types/api'; // Asegúrate de que las rutas sean correctas

//  variables con el 
const API_BASE_URL = 'https://bank-crap-servi.onrender.com/api/v1';
const API_KEY = 'BanCrapTEC2025SecretKey!';

console.log("url>>> "+API_BASE_URL);
console.log("api>>> "+API_KEY);
if (!API_BASE_URL || !API_KEY) {
    
    throw new Error("Las variables de entorno API_BASE_URL o API_KEY no están definidas.");
}

/**
 * Realiza una solicitud POST para iniciar sesión.
 * @param data Los datos de usuario y contraseña.
 * @returns La respuesta exitosa del login (LoginResponse).
 * @throws Un error con el mensaje de la API en caso de fallo.
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  // Construye el endpoint completo
  const endpoint = `${API_BASE_URL}/auth/login`;

  try {
    const response = await axios.post<LoginResponse>(endpoint, data, {
      headers: {
        // Usamos la clave obtenida del .env
        'x-api-key': API_KEY, 
        'Content-Type': 'application/json',
      },
      // Permite que Axios lance un error para códigos de estado >= 400
      validateStatus: (status) => status >= 200 && status < 300,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Manejo de errores específicos de Axios
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response && axiosError.response.data) {
        // El servidor respondió con un código de error (p.ej., 401 Unauthorized)
        throw new Error(
          axiosError.response.data.message ||
            `Error de API: ${axiosError.response.status}`,
        );
      } else if (axiosError.request) {
        // La solicitud fue hecha pero no se recibió respuesta (p.ej., error de red)
        throw new Error('Error de red o el servidor no respondió.');
      }
    }
    // Otros errores (p.ej., error de la función)
    throw new Error('Ha ocurrido un error inesperado al iniciar sesión.');
  }
}