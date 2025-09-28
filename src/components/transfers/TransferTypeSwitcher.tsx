import styles from './Transfers.module.css';
import { useTranslations } from 'next-intl';
type Props = {
  currentType: 'PROPIAS' | 'TERCEROS';
  onTypeChange: (type: 'PROPIAS' | 'TERCEROS') => void;
};

export default function TransferTypeSwitcher({ currentType, onTypeChange }: Props) {
  const t = useTranslations('Transfers');
  return (
    <div className={styles.switcher_container} role="tablist" aria-label={t('switcher_aria_label')}>
      <button 
        onClick={() => onTypeChange('PROPIAS')}
        className={currentType === 'PROPIAS' ? styles.switcher_active : styles.switcher_inactive}
        role="tab"
        aria-selected={currentType === 'PROPIAS'}
      >
        {t('type_own_accounts')}
      </button>
      <button
        onClick={() => onTypeChange('TERCEROS')}
        className={currentType === 'TERCEROS' ? styles.switcher_active : styles.switcher_inactive}
        role="tab"
        aria-selected={currentType === 'TERCEROS'}
      >
        {t('type_third_party')}
      </button>
    </div>
  );
}