import { z } from 'zod';

export const registerSchema = z.object({
  idType: z.enum(['Nacional', 'DIMEX', 'Pasaporte'], {
    // La validación utiliza los valores amigables al usuario (Nacional, DIMEX, Pasaporte)
    message: 'El tipo de identificación es obligatorio', 
  }),
  idNumber: z.string().min(1, 'El número de identificación es obligatorio')
    .refine((val) => {
      // Lógica de validación
      return true;
    }, 'El formato del número de identificación no es válido'),
  username: z.string()
    .min(4, 'El nombre de usuario debe tener al menos 4 caracteres')
    .max(20, 'El nombre de usuario no puede exceder los 20 caracteres')
    .regex(/^[a-z0-9._-]+$/, 'El nombre de usuario solo puede contener minúsculas, números, y los símbolos ._-'),
  fullName: z.string().min(1, 'El nombre completo es obligatorio'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  email: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('El formato del correo electrónico no es válido')
    .transform(val => val.toLowerCase()),
  phone: z.string().regex(/^\+506\s\d{4}-\d{4}$/, 'Formato de teléfono incorrecto (+506 ####-####)').optional().or(z.literal('')),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos 1 mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos 1 minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos 1 dígito'),
  confirmPassword: z.string().min(1, 'La confirmación de contraseña es obligatoria'),
  acceptTerms: z.boolean()
    .refine(val => val === true, 'Debe aceptar los términos y condiciones'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;