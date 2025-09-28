// components/ui/Button.tsx
import styles from './Button.module.css';

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

export default function Button({ onClick, children, variant = 'primary', disabled = false, type }: ButtonProps) {
  const variantClass = variant === 'primary' ? styles.btn_primary : styles.btn_secondary;
  
  return (
    <button onClick={onClick} className={`${styles.btn} ${variantClass}`} disabled={disabled} type={type? type : 'button'}>
      {children}
    </button>
  );
}