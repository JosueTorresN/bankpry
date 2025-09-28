import { UseFormRegisterReturn } from 'react-hook-form';
import styles from './SelectField.module.css';

type Option = { value: string | number; label: string; disabled?: boolean };
type Props = {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  options: Option[];
  className?: string;
  disabled?: boolean;
  value?: string | number;
  defaultValue?: string | number;
};

export default function SelectField({ id, label, registration, error, options, className = '', ...props }: Props) {
  // CAMBIO: Obtenemos el texto de la opción seleccionada para usarlo en el title.
  const selectedValue = props.value || props.defaultValue;
  const selectedOption = options.find(opt => opt.value === selectedValue);
  
  return (
    <div className={styles.input_wrapper}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <select 
        id={id} 
        {...registration} 
        className={`${styles.select_element} ${error ? styles.input_error : ''} ${className}`}
        // CAMBIO: Añadimos el title para que el tooltip muestre el texto completo.
        title={selectedOption ? selectedOption.label : label}
        {...props}
      >
        {options.map(opt => <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>)}
      </select>
      {error && <p className={styles.error_text}>{error}</p>}
    </div>
  );
}