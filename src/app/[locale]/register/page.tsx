// app/register/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl'; // Importamos el hook
import AuthLayout from '@/components/auth/AuthLatout'; 
import RegisterForm from '@/components/forms/register/registerForm';
import Alert from '@/components/alert/alert';
import layoutStyles from '@/components/auth/AuthLayout.module.css';

// CAMBIO 1: Importamos el tipo de datos del formulario desde el esquema de Zod.
import { RegisterFormValues } from '@/lib/validations/registerSchema';

export default function RegisterPage() {
  const t = useTranslations('Auth');
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
        title={`${t('welcome_title')}, ${userName}!`} 
        description={t('success_description')}
      >
        <div className={layoutStyles.success_container}>
          <Alert message={t('verify_email_alert')} type="success">
            {t('verify_email_alert')}
          </Alert>
          <Link href="/login" className={layoutStyles.btn_primary_link}>
           {t('go_to_login_button')}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title={t('brand_title')}
      description={t('brand_description')}
    >
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
    </AuthLayout>
  );
}