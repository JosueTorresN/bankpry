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
    // 1. Limpiamos cualquier error previo del formulario
    setError("root", { message: undefined });

    // La promesa de setTimeout ya no es necesaria, Axios es asíncrono
    // await new Promise(resolve => setTimeout(resolve, 1000)); 

    try {
      // -----------------------------------------------------------------
      // 2. LLAMADA A LA API CON AXIOS
      // -----------------------------------------------------------------
      // El esquema Zod debe garantizar que 'data' contenga 'username' y 'password'.
      const response = await login(data); 

      // -----------------------------------------------------------------
      // 3. ÉXITO: Procesar la respuesta
      // -----------------------------------------------------------------
      console.log('Login exitoso. Token recibido:', response.data.token);
      localStorage.setItem("TOKEN", response.data.token);
      // Llamamos a la función de éxito y redirigimos
      onLoginSuccess(data.username);
      router.push("/dashboard"); 

    } catch (error: any) {
      // -----------------------------------------------------------------
      // 4. ERROR: Mostrar el mensaje de error de la API
      // -----------------------------------------------------------------
      console.error('API Login Error:', error.message);
      
      // Establecemos el error 'root' con el mensaje devuelto por la función 'login'
      setError("root", {
        message: error.message || "Fallo en la conexión. Inténtalo de nuevo.",
      });
      
    }
  };

  return (
    <form className={styles.login_form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className={styles.form_title}>Iniciar sesión</h1>

      {errors.root && (
        // El componente Alert ya está implementado para mostrar el error de la API
        <Alert message={errors.root.message || ''} type="error">
          {errors.root.message || ''}
        </Alert>
      )}

      {/* InputFields... (el resto de tu JSX queda igual) */}
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