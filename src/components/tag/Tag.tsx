// components/ui/Tag.tsx
import styles from './Tag.module.css';

type TagProps = {
  label: string;
  variant?: 'info' | 'success';
};

export default function Tag({ label, variant = 'info' }: TagProps) {
  const variantClass = variant === 'success' ? styles.tag_success : styles.tag_info;
  
  return <span className={`${styles.tag} ${variantClass}`}>{label}</span>;
}