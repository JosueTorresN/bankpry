"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/lib/validations/loginSchema';
import InputField from '@/components/forms/inputs/inputField';
import Alert from '@/components/alert/alert';
import styles from "./LoginForm.module.css";
import { useRouter, Link } from '@/i18n/routing';

// -----------------------------------------------------------------
// 1. IMPORTAR SERVICIO DE AUTENTICACIÓN
// Asume que la ruta es correcta.
import { login } from '@/services/auth'; 
// Asume que tu LoginFormValues de Zod es compatible con LoginRequest (que debería serlo)
// -----------------------------------------------------------------

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

  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {

    setError("root", { message: undefined });


    try {
      const response = await login(data); 

      console.log('Login exitoso. Token recibido:', response.data.token);
      localStorage.setItem("TOKEN", response.data.token);
      // Llamamos a la función de éxito y redirigimos
      onLoginSuccess(data.username);
      router.push("/dashboard"); 

    } catch (error: any) {

      console.error('API Login Error:', error.message);
      
      setError("root", {
        message: error.message || "Fallo en la conexión. Inténtalo de nuevo.",
      });
      
    }
  };

  return (
    <form className={styles.login_form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className={styles.form_title}>Iniciar sesión</h1>

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