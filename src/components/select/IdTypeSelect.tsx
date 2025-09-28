// components/select/IdTypeSelect.tsx
import { useTranslations } from 'next-intl';
import { UseFormRegister } from 'react-hook-form';
import { RegisterFormValues } from '@/lib/validations/registerSchema';
import Alert from '../alert/alert';
import styles from './IdTypeSelect.module.css'; // Importamos el módulo CSS

type IdTypeSelectProps = {
  register: UseFormRegister<RegisterFormValues>;
  error?: string;
};

// Usamos la sintaxis de función estándar (recomendada sobre React.FC)
export default function IdTypeSelect({ register, error }: IdTypeSelectProps) {
  // Combinamos clases condicionalmente para el estado de error
  const t = useTranslations('Auth');
  const selectClassName = `${styles.select_element} ${error ? styles.select_error : ''}`;

  return (
    <div className={styles.select_container}>
      <label htmlFor="idType" className={styles.label}>
        {t('id_type_label')}
      </label>
      <select
        id="idType"
        {...register('idType')}
        className={selectClassName}
        defaultValue="" // Es buena práctica tener un valor por defecto
      >
        <option value="" disabled>{t('select_option_default')}</option>
        <option value="Nacional">{t('id_option_national')}</option>
        <option value="DIMEX">{t('id_option_dimex')}</option>
        <option value="Pasaporte">{t('id_option_passport')}</option>
      </select>
      {error && <Alert message={error} type="error">{error}</Alert>}
    </div>
  );
}