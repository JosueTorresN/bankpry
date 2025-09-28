"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transferSchema, TransferFormValues } from '@/lib/validations/transferSchema';
import { findThirdPartyOwner, formatCurrency } from '@/lib/data/accounts';
import { Account } from '@/lib/types/accounts';
import SelectField from '@/components/forms/inputs/SelectField';
import InputField from '@/components/forms/inputs/inputField';
import Button from '@/components/button/button';
import Alert from '@/components/alert/alert';
import styles from './TransferForm.module.css';

type Props = {
  userAccounts: Account[];
  initialType: 'PROPIAS' | 'TERCEROS';
  onTypeChange: (type: 'PROPIAS' | 'TERCEROS') => void;
  onSubmit: (data: TransferFormValues) => void;
};

export default function TransferForm({ userAccounts, initialType, onTypeChange, onSubmit }: Props) {
  const { register, handleSubmit, formState: { errors, isValid, isSubmitting }, watch, setValue, trigger } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    mode: 'onTouched',
    defaultValues: { transferType: initialType, amount: undefined, sourceAccountId: '', targetAccountId: '' }
  });

  const sourceAccountId = watch('sourceAccountId');
  const sourceAccount = userAccounts.find(a => a.account_id === sourceAccountId);

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
    ...userAccounts.map(a => ({ value: a.account_id, label: `${a.alias} (${a.currency}) - ${formatCurrency(a.balance, a.currency)}` }))
  ];

  const targetAccountOptions = [
    { value: '', label: 'Seleccione cuenta destino', disabled: true },
    ...userAccounts
      .filter(a => a.account_id !== sourceAccountId && a.currency === sourceAccount?.currency)
      .map(a => ({ value: a.account_id, label: `${a.alias} (${a.currency})` }))
  ];
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form_container}>
      <h2 className={styles.form_title}>
        {initialType === 'PROPIAS' ? 'Transferencia Interna' : 'Transferencia a Terceros'}
      </h2>
      
      {/* Muestra errores generales del esquema (como el de saldo) */}
      {errors.amount?.message?.includes('Saldo insuficiente') && (
        <Alert message={errors.amount.message} type="error">
          {errors.amount.message}
        </Alert>
      )}

      <SelectField id="sourceAccountId" label="Desde mi cuenta" registration={register('sourceAccountId')} options={sourceAccountOptions} error={errors.sourceAccountId?.message} />

      {initialType === 'PROPIAS' ? (
        <SelectField id="targetAccountId" label="Hacia mi cuenta" registration={register('targetAccountId')} options={targetAccountOptions} error={errors.targetAccountId?.message} disabled={!sourceAccount} />
      ) : (
        <div className={styles.third_party_container}>
          <InputField id="targetAccountId" label="Cuenta Destino de Tercero" registration={register('targetAccountId')} error={errors.targetAccountId?.message} />
          <Button onClick={handleValidateThirdParty} variant="secondary">Validar</Button>
          {watch('targetOwner') && <p className={styles.owner_success}>✅ Titular: {watch('targetOwner')}</p>}
        </div>
      )}
      
      <div className={styles.currency_display}>
        <label className={styles.label}>Moneda</label>
        <p>{sourceAccount?.currency || '---'}</p>
      </div>

      <InputField id="amount" label={`Monto (${sourceAccount?.currency || ''})`} type="number" registration={register('amount', { valueAsNumber: true })} error={errors.amount?.message} disabled={!sourceAccount} />
      <InputField id="description" label="Descripción (Opcional)" registration={register('description')} error={errors.description?.message} />
      
      <Button type="submit" disabled={!isValid || isSubmitting} onClick={() => {}}>
        {isSubmitting ? 'Procesando...' : 'Continuar'}
      </Button>
    </form>
  );
}