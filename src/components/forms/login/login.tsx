// components/forms/login/login.jsx
"use client";

import { useState } from 'react';
import Link from "next/link";
import styles from "./Login.module.css";
import Alert from '@/components/alert/alert';

// 1. Recibimos 'onLoginSuccess' como una prop
interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  // 2. Estados para los campos del formulario y el mensaje de error
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 3. Función que se ejecuta al enviar el formulario
  interface SubmitEvent extends React.FormEvent<HTMLFormElement> {}

  interface Credentials {
    username: string;
    password: string;
  }

  const handleSubmit = (event: SubmitEvent): void => {
    event.preventDefault(); // Evita que la página se recargue
    setError(''); // Limpia errores anteriores

    // 4. Lógica de autenticación MOCK (simulada)
    // Comprueba si el usuario y la contraseña son correctos (puedes cambiarlos)
    const credentials: Credentials = { username, password };

    if (credentials.username === 'admin' && credentials.password === '1234') {
      // Si son correctos, llama a la función del componente padre
      onLoginSuccess(credentials.username);
    } else {
      // Si no, muestra un mensaje de error
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    // 5. Vinculamos la función handleSubmit al evento onSubmit del formulario
    <form className={styles.login_form} onSubmit={handleSubmit}>
      <h1 className={styles.login_title}>Iniciar sesión</h1>

      {/* Mensaje de error que solo aparece si hay un error */}
      {error && <Alert message={error} type="error" />}

      <label htmlFor="username" className={styles.sr_only}>Usuario</label>
      <input
        type="text"
        id="username"
        className={styles.input_field}
        placeholder="Usuario"
        // 6. Controlamos el valor del input con el estado
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label htmlFor="password" className={styles.sr_only}>Contraseña</label>
      <input
        type="password"
        id="password"
        className={styles.input_field}
        placeholder="Contraseña"
        // 7. Controlamos el valor del input con el estado
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className={styles.btn_primary}>
        Login
      </button>

      <p className={styles.register_text}>
        ¿No tienes cuenta? <Link href="#" className={styles.link}>Regístrate</Link>
      </p>
    </form>
  );
}