// app/register/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl'; 
import AuthLayout from '@/components/auth/AuthLatout'; 
import RegisterForm from '@/components/forms/register/registerForm';
import Alert from '@/components/alert/alert';
import layoutStyles from '@/components/auth/AuthLayout.module.css';


import { RegisterFormValues } from '@/lib/validations/registerSchema';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const [isRegistered, setIsRegistered] = useState(false);

  const [userName, setUserName] = useState('');


  const handleRegisterSuccess = (data: RegisterFormValues) => {
    setUserName(data.fullName);
    setIsRegistered(true);
  };

  if (isRegistered) {
    return (
      <AuthLayout 

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