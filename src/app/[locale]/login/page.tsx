"use client";

import { useState } from 'react';
// 1. Import useTranslations from next-intl
import { useTranslations } from 'next-intl'; 
import AuthLayout from '@/components/auth/AuthLatout';
import LoginForm from "@/components/forms/login/loginForm";
import layoutStyles from '@/components/auth/AuthLayout.module.css'; // Estilos del Layout

export default function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // 2. Initialize the translation function, scoped to 'Login'
  // (Assuming you'll have a structure like { "Login": { "welcome_title": "..." } })
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
        // Use translation key for the title and pass the username as an interpolation value
        title={t('welcome_title', { username: username })}
        description={t('login_success_description')}
      >
        <div className={layoutStyles.success_container}>
          <button onClick={handleLogout} className={layoutStyles.btn_primary_link}>
            {/* Use translation key for the button text */}
            {t('logout_button')}
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      // Use translation keys for the login screen title and description
      title={t('app_name')}
      description={t('login_description')}
    >
      {/* LoginForm will also need to be updated internally to use useTranslations for its text */}
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}
