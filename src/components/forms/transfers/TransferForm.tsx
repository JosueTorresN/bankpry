"use client";
import { useState, useMemo } from 'react'; // Importar useState
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Importar la nueva función de servicio
import { validateExternalAccount } from '@/services/transfers'; 
import { createTransferSchema, TransferFormValues } from '@/lib/validations/transferSchema';
import { formatCurrency } from '@/lib/data/accounts';
import { Account } from '@/lib/types/accounts';
import SelectField from '@/components/forms/inputs/SelectField';
import InputField from '@/components/forms/inputs/inputField';
import Button from '@/components/button/button';
import Alert from '@/components/alert/alert';
import LoadingSpinner from '@/components/feedBack/loadingSpineer'; // Asegúrate de tener este import
import styles from './TransferForm.module.css';
import { useTranslations } from 'next-intl';
type Props = {
  userAccounts: Account[];
  initialType: 'PROPIAS' | 'TERCEROS';
  onTypeChange: (type: 'PROPIAS' | 'TERCEROS') => void;
  onSubmit: (data: TransferFormValues) => void;
  token: string | null; // <--- NUEVO PROP: Necesitamos el token aquí
};

export default function TransferForm({ userAccounts, initialType, onTypeChange, onSubmit, token }: Props) {
  const t = useTranslations('Transfers');
  // Estado local para saber si estamos validando la cuenta externa
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const transferSchema = useMemo(() => createTransferSchema(userAccounts), [userAccounts]);

  const { register, handleSubmit, formState: { errors, isValid, isSubmitting }, watch, setValue, trigger, setError, clearErrors } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    mode: 'onTouched',
    defaultValues: { transferType: initialType, amount: undefined, sourceAccountId: '', targetAccountId: '' }
  });

  const sourceAccountId = watch('sourceAccountId');
  const sourceAccount = userAccounts.find(a => a.id === sourceAccountId);

  const handleValidateThirdParty = async () => {
      // 1. Limpiar estados previos
      setValidationError(null);
      setValue('targetOwner', undefined); // Resetear dueño
      
      // 2. Validar que el campo IBAN no esté vacío usando Zod
      const isFieldValid = await trigger('targetAccountId');
      if (!isFieldValid) return;

      const targetId = watch('targetAccountId');
      
      if (!token) {
          setValidationError("No hay sesión activa para validar.");
          return;
      }

      setIsValidating(true);

      try {
          // 3. Llamada real al Backend
          const ownerName = await validateExternalAccount(targetId, token);
          
          // 4. Éxito: Escribir el nombre y revalidar el formulario para activar el botón de "Continuar"
          setValue('targetOwner', ownerName, { shouldValidate: true });
          clearErrors('targetAccountId');

      } catch (error: any) {
          // 5. Error: Mostrar mensaje y asignar error al campo
          console.error(error);
          const msg = error.message || 'Error al validar cuenta';
          setValidationError(msg);
          setError('targetAccountId', { type: 'manual', message: msg });
      } finally {
          setIsValidating(false);
      }
  };
  
  const sourceAccountOptions = [
    { value: '', label: 'Seleccione cuenta origen', disabled: true },
    ...userAccounts.map(a => ({id: a.id, value: a.id, label: `${a.alias} (${a.currency}) - ${formatCurrency(a.balance, a.currency)}` }))
  ];

  const targetAccountOptions = [
    { value: '', label: 'Seleccione cuenta destino', disabled: true },
    ...userAccounts
      .filter(a => a.id !== sourceAccountId && a.currency === sourceAccount?.currency)
      .map(a => ({ value: a.id, label: `${a.alias} (${a.currency})` }))
  ];
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form_container}>
      <h2 className={styles.form_title}>
        {initialType === 'PROPIAS' ? t('title_internal_transfer') : t('title_third_party_transfer')}
      </h2>
      
      {/* Muestra errores generales del esquema (como el de saldo) */}
      {errors.amount?.message?.includes('Saldo insuficiente') && (
        <Alert message={errors.amount.message} type="error">
          {errors.amount.message}
        </Alert>
      )}

      <SelectField id="sourceAccountId" label={t('label_source_account')}  registration={register('sourceAccountId')} options={sourceAccountOptions} error={errors.sourceAccountId?.message} />

      {initialType === 'PROPIAS' ? (
        <SelectField id="targetAccountId" label={t('label_target_account_own')} registration={register('targetAccountId')} options={targetAccountOptions} error={errors.targetAccountId?.message} disabled={!sourceAccount} />
      ) : (
        <div className={styles.third_party_container}>
          <InputField id="targetAccountId" label={t('label_target_account_third')} registration={register('targetAccountId')} error={errors.targetAccountId?.message} />
          <Button
            type="button"
            onClick={handleValidateThirdParty} 
            variant="secondary"
            disabled={isValidating || !watch('targetAccountId')}
          >
            {isValidating ? <LoadingSpinner /> : t('validate_button')}
          </Button>

          {/* Mensajes de Feedback de validación */}
          {validationError && <p className={styles.error_text} style={{color: 'red', marginTop: '0.5rem'}}>{validationError}</p>}
          {watch('targetOwner') && <p className={styles.owner_success}>✅ {t('owner_success_label')}: <strong>{watch('targetOwner')}</strong></p>}
        </div>
      )}
      
      <div className={styles.currency_display}>
        <label className={styles.label}>{t('label_currency')}</label>
        <p>{sourceAccount?.currency || '---'}</p>
      </div>

      <InputField id="amount" label={`${t('label_amount')} (${sourceAccount?.currency || ''})`} type="number" registration={register('amount', { valueAsNumber: true })} error={errors.amount?.message} disabled={!sourceAccount} />
      <InputField id="description" label={t('label_description_optional')} registration={register('description')} error={errors.description?.message} />
      
      <Button type="submit" disabled={!isValid || isSubmitting} onClick={() => {}}>
        {isSubmitting ? t('processing_button') : t('continue_button')}
      </Button>
    </form>
  );
}