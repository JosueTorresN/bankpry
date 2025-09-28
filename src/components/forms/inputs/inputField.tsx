import { UseFormRegisterReturn } from 'react-hook-form';
import styles from './InputField.module.css';
import Alert from '@/components/alert/alert';

type InputFieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  registration: UseFormRegisterReturn; // Prop para react-hook-form
  error?: string; // Prop para el mensaje de error
};

export default function InputField({ id, label, type = "text", registration, error, ...props }: InputFieldProps) {
  return (
    <div className={styles.input_wrapper}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={`${styles.input_field} ${error ? styles.input_error : ''}`}
        aria-invalid={!!error}
        disabled={props.disabled? props.disabled : false}
        {...registration} // Conecta el input con react-hook-form
        {...props}
      />
      {error && <Alert message={error} type="error">{error}</Alert>}
    </div>
  );
}