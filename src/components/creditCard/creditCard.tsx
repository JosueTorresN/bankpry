// components/cards/CreditCard.tsx
"use client";
import { useRouter } from 'next/navigation';
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
  const limitUsedPercentage = (card.currentBalance / card.limit) * 100;
  
  const handleViewDetails = () => router.push(`/cards/${card.id}`);

  // Para accesibilidad, proveemos el número completo en un aria-label
  const maskedNumber = maskCardNumber(card.cardNumber);
  const fullNumberLabel = `Número de tarjeta: ${card.cardNumber.split('').join(' ')}`;

  return (
    <article className={styles.card_wrapper}>
      {/* Componente visual de la tarjeta */}
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
              <span className={styles.footer_label}>Vence</span>
              <span>{card.exp}</span>
            </div>
            <span className={styles.holder_name}>{card.holder}</span>
          </div>
        </div>
      </div>

      {/* Resumen de la tarjeta */}
      <section className={styles.card_summary}>
        <div>
          <p className={styles.summary_label}>Consumido</p>
          <p className={styles.summary_value}>{formatCurrency(card.currentBalance, card.currency)}</p>
        </div>
        <ProgressBar value={limitUsedPercentage} />
        <div className={styles.summary_limit}>
          <span>Límite Total:</span>
          <span>{formatCurrency(card.limit, card.currency)}</span>
        </div>
        <Button onClick={handleViewDetails}>Ver Movimientos</Button>
      </section>
    </article>
  );
}