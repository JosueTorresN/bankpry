// app/register/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLatout'; // Corregido: AuthLayout
import RegisterForm from '@/components/forms/register/registerForm'; // Corregido: RegisterForm
import Alert from '@/components/alert/alert';
import layoutStyles from '@/components/auth/AuthLayout.module.css';

// CAMBIO 1: Importamos el tipo de datos del formulario desde el esquema de Zod.
import { RegisterFormValues } from '@/lib/validations/registerSchema';

export default function RegisterPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  // CAMBIO 2: Guardaremos el nombre completo para un mensaje más personal.
  const [userName, setUserName] = useState('');

  // CAMBIO 3: La función ahora espera el objeto 'data' completo, no solo el email.
  const handleRegisterSuccess = (data: RegisterFormValues) => {
    setUserName(data.fullName); // Usamos el nombre completo del objeto de datos
    setIsRegistered(true);
  };

  if (isRegistered) {
    return (
      <AuthLayout 
        // CAMBIO 4: Mensaje de bienvenida personalizado con el nombre.
        title={`¡Bienvenido, ${userName}!`} 
        description="Tu cuenta ha sido creada exitosamente."
      >
        <div className={layoutStyles.success_container}>
          <Alert message="Revisa tu correo para verificar tu cuenta." type="success">
            Revisa tu correo para verificar tu cuenta.
          </Alert>
          <Link href="/login" className={layoutStyles.btn_primary_link}>
            Ir a Iniciar Sesión
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="BanCrap"
      description="Tu banco en línea seguro y confiable"
    >
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
    </AuthLayout>
  );
}