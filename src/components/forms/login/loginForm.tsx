"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/lib/validations/loginSchema';
import Link from "next/link";
import InputField from '@/components/forms/inputs/inputField';
import Alert from '@/components/alert/alert';
import styles from "./LoginForm.module.css";

type LoginFormProps = {
  onLoginSuccess: (username: string) => void;
};

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Simula una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Lógica de autenticación MOCK
    if (data.username === 'admin' && data.password === '1234') {
      onLoginSuccess(data.username);
    } else {
      // Usamos setError de react-hook-form para mostrar un error general
      setError("root", {
        message: "Usuario o contraseña incorrectos.",
      });
    }
  };

  return (
    <form className={styles.login_form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className={styles.form_title}>Iniciar sesión</h1>

      {/* Muestra el error principal del formulario */}
      {errors.root && (
        <Alert message={errors.root.message || ''} type="error">
          {errors.root.message || ''}
        </Alert>
      )}

      <InputField
        id="username"
        label="Usuario"
        registration={register('username')}
        error={errors.username?.message}
        placeholder="Usuario"
      />
      <InputField
        id="password"
        label="Contraseña"
        type="password"
        registration={register('password')}
        error={errors.password?.message}
        placeholder="Contraseña"
      />

      <button type="submit" className={styles.btn_primary} disabled={isSubmitting}>
        {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
      </button>

      <p className={styles.redirect_text}>
        ¿No tienes cuenta? <Link href="/register" className={styles.link}>Regístrate</Link>
      </p>
    </form>
  );
}