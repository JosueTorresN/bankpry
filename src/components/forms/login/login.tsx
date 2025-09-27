// components/forms/login.jsx

import Link from "next/link";
// El nombre del import (en este caso 'style') puede ser el que quieras, pero 'styles' es la convención.
import styles from "./Login.module.css"; 

export default function Login() {
  return (
    // Antes: className="login-container"
    // Ahora: className={styles.login_container}
    <main className={styles.login_container}>
      <form className={styles.login_form} aria-label="Login form">
        <h1 className={styles.login_title}>Iniciar sesión</h1>

        <label htmlFor="username" className={styles.sr_only}>
          Usuario
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Usuario"
          required
        />

        <label htmlFor="password" className={styles.sr_only}>
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Contraseña"
          required
        />

        <button type="submit" className={styles.btn_primary}>
          Login
        </button>

        <p className={styles.register_text}>
          ¿No tienes cuenta?{" "}
          <Link href="#" className={styles.link}>
            Regístrate
          </Link>
        </p>
      </form>
    </main>
  );
}