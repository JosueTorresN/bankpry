"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@/lib/validations/registerSchema';
import InputField from '@/components/forms/inputs/inputField';
import IdTypeSelect from '@/components/select/IdTypeSelect';
import styles from './RegisterForm.module.css';
import { useTranslations } from 'next-intl';
type RegisterFormProps = {
  onRegisterSuccess: (data: RegisterFormValues) => void;
};

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const t = useTranslations('Auth');
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
        <h2 className={styles.form_title}>{t('register_form_title')}</h2>
        
        <IdTypeSelect register={register} error={errors.idType?.message} />
        
        <InputField id="idNumber" label={t('id_number_label')} registration={register('idNumber')} error={errors.idNumber?.message} />
        <InputField id="username" label={t('username_label')} registration={register('username')} error={errors.username?.message} />
        <InputField id="fullName" label={t('full_name_label')} registration={register('fullName')} error={errors.fullName?.message} />
        <InputField id="birthDate" label={t('birth_date_label')} type="date" registration={register('birthDate')} error={errors.birthDate?.message} />
        <InputField id="email" label={t('email_label')} type="email" registration={register('email')} error={errors.email?.message} />
        <InputField id="phone" label={t('phone_label_optional')} type="tel" placeholder="+506 ####-####" registration={register('phone')} error={errors.phone?.message} />
        <InputField id="password" label={t('password_label')} type="password" registration={register('password')} error={errors.password?.message} />
        <InputField id="confirmPassword" label={t('confirm_password_label')} type="password" registration={register('confirmPassword')} error={errors.confirmPassword?.message} />

        <div className={styles.terms_container}>
          <input type="checkbox" id="acceptTerms" {...register('acceptTerms')} className={styles.checkbox} />
          <label htmlFor="acceptTerms" className={styles.label}>
            {t('accept_terms_prefix')} <button type="button" onClick={() => setShowTerms(true)} className={styles.link}>{t('terms_link_text')}</button>
          </label>
        </div>
        {errors.acceptTerms && <p className={styles.error_text_centered}>{errors.acceptTerms.message}</p>}

        <button type="submit" disabled={!watchAcceptTerms || isSubmitting} className={styles.btn_primary}>
          {isSubmitting ? t('registering_button') : t('register_button')}
        </button>
      </form>

      {/* Modal para términos y condiciones */}
      {showTerms && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_content}>
            <div className={styles.modal_header}>
              <h3 className={styles.modal_title}>{t('terms_modal_title')}</h3>
              <button onClick={() => setShowTerms(false)} className={styles.modal_close_btn}>&times;</button>
            </div>
            <iframe src="/Terminos.pdf" className={styles.modal_iframe} title={t('terms_modal_title')}></iframe>
          </div>
        </div>
      )}
    </>
  );
}