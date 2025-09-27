// components/ui/ProgressBar.tsx
import styles from './ProgressBar.module.css';

type ProgressBarProps = {
  value: number; // Valor de 0 a 100
};

export default function ProgressBar({ value }: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={styles.progress_bar_container}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progreso de uso: ${clampedValue.toFixed(0)}%`}
    >
      <div 
        className={styles.progress_bar_fill} 
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}