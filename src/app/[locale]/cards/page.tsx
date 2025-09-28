// app/cards/page.tsx
"use client";
import { useTranslations } from 'next-intl'; // Import the hook
import { useCards } from '@/lib/hooks/useCards';
import CreditCard from '@/components/creditCard/creditCard';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import ErrorMessage from '@/components/alert/Alert.module.css';
import styles from './CardsPage.module.css';
import Alert from '@/components/alert/alert';

export default function CardsDashboardPage() {
  const { cards, loading, error } = useCards();
  const t = useTranslations('Cards'); 
  const renderContent = () => {
    if (loading) {
      return <div className={styles.centered_feedback}><LoadingSpinner /></div>;
    }
    if (error) {
      return (
        <div className={styles.centered_feedback}>
          <Alert message={error} type="error">{error}</Alert>
        </div>
      );
    }
    if (cards.length === 0) {
      return <p className={styles.centered_feedback}>{t('no_cards_message')}</p>;
    }
    return (
      <div className={styles.cards_carousel} aria-label={t('carousel_aria_label')}>
        {cards.map((card) => (
          <CreditCard key={card.id} card={card} />
        ))}
      </div>
    );
  };

  return (
    <main className={styles.page_container}>
      <h1 className={styles.page_title}>{t('page_title')}</h1>
      {renderContent()}
    </main>
  );
}