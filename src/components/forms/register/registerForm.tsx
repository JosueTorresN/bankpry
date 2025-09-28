"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@/lib/validations/registerSchema';
import InputField from '@/components/forms/inputs/inputField';
import IdTypeSelect from '@/components/select/IdTypeSelect';
import styles from './RegisterForm.module.css';

type RegisterFormProps = {
  onRegisterSuccess: (data: RegisterFormValues) => void;
};

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const [showTerms, setShowTerms] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const watchAcceptTerms = watch('acceptTerms');

  const onSubmit = async (data: RegisterFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simula llamada a API
    onRegisterSuccess(data);
  };

  return (
    <>
      <form className={styles.register_form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2 className={styles.form_title}>Registro de Usuario</h2>
        
        <IdTypeSelect register={register} error={errors.idType?.message} />
        
        <InputField id="idNumber" label="Número de Identificación" registration={register('idNumber')} error={errors.idNumber?.message} />
        <InputField id="username" label="Username" registration={register('username')} error={errors.username?.message} />
        <InputField id="fullName" label="Nombre Completo" registration={register('fullName')} error={errors.fullName?.message} />
        <InputField id="birthDate" label="Fecha de Nacimiento" type="date" registration={register('birthDate')} error={errors.birthDate?.message} />
        <InputField id="email" label="Correo Electrónico" type="email" registration={register('email')} error={errors.email?.message} />
        <InputField id="phone" label="Teléfono (Opcional)" type="tel" placeholder="+506 ####-####" registration={register('phone')} error={errors.phone?.message} />
        <InputField id="password" label="Contraseña" type="password" registration={register('password')} error={errors.password?.message} />
        <InputField id="confirmPassword" label="Confirmar Contraseña" type="password" registration={register('confirmPassword')} error={errors.confirmPassword?.message} />

        <div className={styles.terms_container}>
          <input type="checkbox" id="acceptTerms" {...register('acceptTerms')} className={styles.checkbox} />
          <label htmlFor="acceptTerms" className={styles.label}>
            Acepto los <button type="button" onClick={() => setShowTerms(true)} className={styles.link}>términos y condiciones</button>
          </label>
        </div>
        {errors.acceptTerms && <p className={styles.error_text_centered}>{errors.acceptTerms.message}</p>}

        <button type="submit" disabled={!watchAcceptTerms || isSubmitting} className={styles.btn_primary}>
          {isSubmitting ? 'Registrando...' : 'Registrar'}
        </button>
      </form>

      {/* Modal para términos y condiciones */}
      {showTerms && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_content}>
            <div className={styles.modal_header}>
              <h3 className={styles.modal_title}>Términos y Condiciones</h3>
              <button onClick={() => setShowTerms(false)} className={styles.modal_close_btn}>&times;</button>
            </div>
            <iframe src="/Terminos.pdf" className={styles.modal_iframe} title="Términos y condiciones"></iframe>
          </div>
        </div>
      )}
    </>
  );
}