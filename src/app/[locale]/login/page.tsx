"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl'; 
import AuthLayout from '@/components/auth/AuthLatout';
import LoginForm from "@/components/forms/login/loginForm";
import layoutStyles from '@/components/auth/AuthLayout.module.css';

export default function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const t = useTranslations('Login'); 

  const handleLoginSuccess = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  if (isLoggedIn) {
    return (
      <AuthLayout 
        title={t('welcome_title', { username: username })}
        description={t('login_success_description')}
      >
        <div className={layoutStyles.success_container}>
          <button onClick={handleLogout} className={layoutStyles.btn_primary_link}>
            {t('logout_button')}
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title={t('app_name')}
      description={t('login_description')}
    >
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}
