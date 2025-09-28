import styles from './Transfers.module.css';

type Props = {
  currentType: 'PROPIAS' | 'TERCEROS';
  onTypeChange: (type: 'PROPIAS' | 'TERCEROS') => void;
};

export default function TransferTypeSwitcher({ currentType, onTypeChange }: Props) {
  return (
    <div className={styles.switcher_container} role="tablist" aria-label="Tipo de transferencia">
      <button 
        onClick={() => onTypeChange('PROPIAS')}
        className={currentType === 'PROPIAS' ? styles.switcher_active : styles.switcher_inactive}
        role="tab"
        aria-selected={currentType === 'PROPIAS'}
      >
        Cuentas Propias
      </button>
      <button
        onClick={() => onTypeChange('TERCEROS')}
        className={currentType === 'TERCEROS' ? styles.switcher_active : styles.switcher_inactive}
        role="tab"
        aria-selected={currentType === 'TERCEROS'}
      >
        A Terceros
      </button>
    </div>
  );
}