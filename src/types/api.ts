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
  token: string; // Ejemplo de un token JWT
  user_id: number;
  // ... otros campos que devuelva la API
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