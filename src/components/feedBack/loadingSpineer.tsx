// components/ui/feedback/LoadingSpinner.tsx
import styles from './LoadingSpineer.module.css';
export default function LoadingSpinner() {
  return <div className={styles.spinner} role="status" aria-label="Cargando..."></div>;
}