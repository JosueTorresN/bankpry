import Link from "next/link";

export default function Login() {
  return (
    <main className="login-container">
      <form className="login-form" aria-label="Login form">
        <h1 className="login-title">Iniciar sesión</h1>

        <label htmlFor="username" className="sr-only">
          Usuario
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Usuario"
          required
        />

        <label htmlFor="password" className="sr-only">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Contraseña"
          required
        />

        <button type="submit" className="btn-primary">
          Login
        </button>

        <p className="register-text">
          ¿No tienes cuenta?{" "}
          <Link href="#" className="link">
            Regístrate
          </Link>
        </p>
      </form>
    </main>
  );
}
