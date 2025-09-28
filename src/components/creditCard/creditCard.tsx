// components/cards/CreditCard.tsx
"use client";
import { useTranslations } from 'next-intl'; 
import { useRouter } from '@/i18n/routing';
import { CreditCard as CreditCardType } from '@/lib/types/cards';
import { formatCurrency, maskCardNumber } from '@/lib/data/cards';
import ProgressBar from '@/components/progreBar/progressBar';
import Button from '@/components/button/button';
import styles from './CreditCard.module.css';

function getCardVariant(type: CreditCardType['type']) {
  switch (type) {
    case 'Black': return styles.variant_black;
    case 'Platinum': return styles.variant_platinum;
    case 'Gold': default: return styles.variant_gold;
  }
}

export default function CreditCard({ card }: { card: CreditCardType }) {
  const router = useRouter();
  const t = useTranslations('Cards'); 
  const limitUsedPercentage = (card.currentBalance / card.limit) * 100;
  
  const handleViewDetails = () => router.push(`/cards/${card.id}`);

  const maskedNumber = maskCardNumber(card.cardNumber);
  const fullNumberLabel = `Número de tarjeta: ${card.cardNumber.split('').join(' ')}`;

  return (
    <article className={styles.card_wrapper}>
      <div className={`${styles.card_visual} ${getCardVariant(card.type)}`}>
        <header className={styles.card_header}>
          <p>{card.type}</p>
          <span>{card.currency}</span>
        </header>
        <div className={styles.card_body}>
          <p className={styles.card_number} aria-label={fullNumberLabel}>
            {maskedNumber}
          </p>
          <div className={styles.card_footer}>
            <div>
              <span className={styles.footer_label}>{t('expires_label')}</span>
              <span>{card.exp}</span>
            </div>
            <span className={styles.holder_name}>{card.holder}</span>
          </div>
        </div>
      </div>

      <section className={styles.card_summary}>
        <div>
          <p className={styles.summary_label}>{t('consumed_label')}</p>
          <p className={styles.summary_value}>{formatCurrency(card.currentBalance, card.currency)}</p>
        </div>
        <ProgressBar value={limitUsedPercentage} />
        <div className={styles.summary_limit}>
          <span>{t('total_limit_label')}</span>
          <span>{formatCurrency(card.limit, card.currency)}</span>
        </div>
        <Button onClick={handleViewDetails}>{t('view_movements_button')}</Button>
      </section>
    </article>
  );
}