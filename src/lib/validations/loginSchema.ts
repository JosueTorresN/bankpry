import { z } from 'zod';

// Define el esquema de validación para el formulario de login
export const loginSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido.'),
  password: z.string().min(1, 'La contraseña es requerida.'),
});

// Infiere el tipo de TypeScript a partir del esquema
export type LoginFormValues = z.infer<typeof loginSchema>;