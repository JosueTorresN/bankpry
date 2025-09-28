import { CreditCard } from '@/lib/types/cards';
import { formatCurrency, maskCardNumber } from '@/lib/data/cards';
import styles from './CardDetailHeader.module.css';
import { useTranslations } from 'next-intl';
type Props = { card: CreditCard };

export default function CardDetailHeader({ card }: Props) {
  const t = useTranslations('CardDetails');
  const limitAvailable = card.limit - card.currentBalance;

  return (
    <header className={styles.header}>
      <h1 className={styles.header_title}>{card.type} {t('type_title')}</h1>
      <p className={styles.header_subtitle}>
        {maskCardNumber(card.cardNumber)} | {card.holder}
      </p>
      <div className={styles.balance_summary}>
        <div className={styles.balance_item}>
          <p className={styles.balance_label_available}>{t('available_limit_label')}</p>
          <p className={styles.balance_value_available}>
            {formatCurrency(limitAvailable, card.currency)}
          </p>
        </div>
        <div className={styles.balance_item}>
          <p className={styles.balance_label_spent}>{t('current_spend_label')}</p>
          <p className={styles.balance_value_spent}>
            {formatCurrency(card.currentBalance, card.currency)}
          </p>
        </div>
      </div>
    </header>
  );
}