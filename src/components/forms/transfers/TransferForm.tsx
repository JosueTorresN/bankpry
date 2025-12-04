"use client";
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTransferSchema, TransferFormValues } from '@/lib/validations/transferSchema';
import { findThirdPartyOwner, formatCurrency } from '@/lib/data/accounts';
import { Account } from '@/lib/types/accounts';
import SelectField from '@/components/forms/inputs/SelectField';
import InputField from '@/components/forms/inputs/inputField';
import Button from '@/components/button/button';
import Alert from '@/components/alert/alert';
import styles from './TransferForm.module.css';
import { useTranslations } from 'next-intl';

type Props = {
  userAccounts: Account[];
  initialType: 'PROPIAS' | 'TERCEROS';
  onTypeChange: (type: 'PROPIAS' | 'TERCEROS') => void;
  onSubmit: (data: TransferFormValues) => void;
};

export default function TransferForm({ userAccounts, initialType, onTypeChange, onSubmit }: Props) {
  const t = useTranslations('Transfers');
  const transferSchema = useMemo(() => createTransferSchema(userAccounts), [userAccounts]);
  const { register, handleSubmit, formState: { errors, isValid, isSubmitting }, watch, setValue, trigger } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    mode: 'onTouched',
    defaultValues: { transferType: initialType, amount: undefined, sourceAccountId: '', targetAccountId: '' }
  });

  const sourceAccountId = watch('sourceAccountId');
  const sourceAccount = userAccounts.find(a => a.id === sourceAccountId);

  const handleValidateThirdParty = async () => {
    // Forzar validación del campo para obtener el valor más reciente
    await trigger('targetAccountId');
    const targetId = watch('targetAccountId');
    const owner = findThirdPartyOwner(targetId);
    // Actualizar el valor y volver a validar el esquema completo
    setValue('targetOwner', owner ? owner.owner_name : undefined, { shouldValidate: true });
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
          <Button onClick={handleValidateThirdParty} variant="secondary">{t('validate_button')}</Button>
          {watch('targetOwner') && <p className={styles.owner_success}>✅ {t('owner_success_label')}: {watch('targetOwner')}</p>}
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