// Indica que este es un Componente de Cliente para poder usar hooks como useState
"use client";

import { useState } from 'react';
import Login from "@/components/forms/login/login";
import Image from "next/image";
import styles from "./Login.module.css";

export default function Home() {
  // 1. Estado para saber si el usuario ha iniciado sesión
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // 2. Función que se ejecutará cuando el login sea exitoso
  // El componente Login llamará a esta función con el nombre de usuario.
  const handleLoginSuccess = (user: any) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  // 3. Función para simular el cierre de sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  // 4. Si el usuario ya inició sesión, muestra una bienvenida
  if (isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.welcome_container}>
          <h1 className={styles.app_title}>¡Bienvenido, {username}!</h1>
          <p className={styles.app_description}>Has iniciado sesión correctamente.</p>
          <button onClick={handleLogout} className={styles.logout_button}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  // 5. Si no, muestra la pantalla de login
  return (
    <div className={styles.container}>
      <div>
        <Image
          src="/logo.png"
          alt="Logo"
          width={150}
          height={150}
          className={styles.logo_image}
        />
        <h1 className={styles.app_title}>BanCrap</h1>
        <p className={styles.app_description}>Tu banco en línea seguro y confiable</p>
      </div>
      {/* Pasamos la función como prop al componente Login */}
      <Login onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}