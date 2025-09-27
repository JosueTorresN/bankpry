// components/ui/Button.tsx
import styles from './Button.module.css';

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export default function Button({ onClick, children, variant = 'primary', disabled = false }: ButtonProps) {
  const variantClass = variant === 'primary' ? styles.btn_primary : styles.btn_secondary;
  
  return (
    <button onClick={onClick} className={`${styles.btn} ${variantClass}`} disabled={disabled}>
      {children}
    </button>
  );
}