// components/select/IdTypeSelect.tsx
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
  const selectClassName = `${styles.select_element} ${error ? styles.select_error : ''}`;

  return (
    <div className={styles.select_container}>
      <label htmlFor="idType" className={styles.label}>
        Tipo de identificación
      </label>
      <select
        id="idType"
        {...register('idType')}
        className={selectClassName}
        defaultValue="" // Es buena práctica tener un valor por defecto
      >
        <option value="" disabled>Seleccione una opción</option>
        <option value="Nacional">Nacional (Cédula)</option>
        <option value="DIMEX">DIMEX</option>
        <option value="Pasaporte">Pasaporte</option>
      </select>
      {error && <Alert message={error} type="error">{error}</Alert>}
    </div>
  );
}