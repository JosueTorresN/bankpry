"use client";

import { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLatout';
import LoginForm from "@/components/forms/login/loginForm";
import layoutStyles from '@/components/auth/AuthLayout.module.css'; // Estilos del Layout

export default function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

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
        title={`¡Bienvenido, ${username}!`} 
        description="Has iniciado sesión correctamente."
      >
        <div className={layoutStyles.success_container}>
          <button onClick={handleLogout} className={layoutStyles.btn_primary_link}>
            Cerrar Sesión
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="BanCrap"
      description="Tu banco en línea seguro y confiable"
    >
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}