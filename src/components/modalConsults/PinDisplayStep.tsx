import { CreditCard, maskCardNumber } from '@/lib/types/cards'; // Asumiendo ruta
import Button from '@/components/button/button';
import styles from './PinConsultModal.module.css';
import { useTranslations } from 'next-intl';

type Props = {
  card: CreditCard;
  seconds: number;
  onCopy: () => void;
  onClose: () => void;
};

export default function PinDisplayStep({ card, seconds, onCopy, onClose }: Props) {
  const t = useTranslations('CardDetails');
  return (
    <div className={`${styles.step_container} ${styles.pin_display}`}>
      <div className={styles.pin_box}>
        <p className={styles.pin_label}>{t('pin_label_with_timer')} ({t('pin_label_with_timer2')} {seconds}s)</p>
        <div className={styles.pin_value_wrapper}>
          <p className={styles.pin_value}>{card.pin} </p>
          <button onClick={onCopy} className={styles.copy_button} aria-label={t('copy_pin_aria_label')}>
            {/* Icono de Copiar (SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 12l-3-3m0 0l-3 3m3-3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          </button>
        </div>
      </div>
      <div className={styles.card_summary}>
        <p><strong>{t('type_label')}:</strong> {card.type}</p>
        <p><strong>{t('number_label')}:</strong> {maskCardNumber(card.cardNumber)}</p>
        <p><strong>{t('cvv_label')}:</strong> {card.cvv}</p>
      </div>
      <Button onClick={onClose} variant="secondary">{t('close_button')}</Button>
    </div>
  );
}