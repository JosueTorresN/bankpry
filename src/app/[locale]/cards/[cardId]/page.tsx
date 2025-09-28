"use client";

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useCardDetails } from '@/lib/hooks/useCardDetails';
import CardDetailHeader from '@/components/creditCard/details/CardDetailHeader';
import MovementFilters from '@/components/creditCard/details/MovementFilters';
import MovementList from '@/components/creditCard/details/MovementList';
import Button from '@/components/button/button';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import Alert from '@/components/alert/alert';
import PinConsultModal from '@/components/modalConsults/PinConsultModal';
import styles from './CardDetailPage.module.css';
import { useTranslations } from 'next-intl';
export default function CardDetailPage() {
  const params = useParams();
  const cardId = params.cardId as string;
  const t = useTranslations('CardDetails');
  // Usamos el hook para obtener los datos
  const { card, movements, loading, error } = useCardDetails(cardId);
  
  // Estado para filtros y modal
  const [filters, setFilters] = useState({ searchText: '', filterType: 'TODOS' });
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Lógica de filtrado con useMemo
  const filteredMovements = useMemo(() => {
    return movements
      .filter(m => filters.filterType === 'TODOS' || m.type === filters.filterType)
      .filter(m => m.description.toLowerCase().includes(filters.searchText.toLowerCase()));
  }, [movements, filters]);

  if (loading) return <div className={styles.centered_feedback}><LoadingSpinner /></div>;
  if (error) return (
    <div className={styles.centered_feedback}>
      <Alert message={error} type='error'>{error}</Alert>
    </div>
  );
  if (!card) return (
    <div className={styles.centered_feedback}>
      <Alert message="Tarjeta no encontrada." type='error'>
        {t('not_found_erro')}
      </Alert>
    </div>
  );

  return (
    <main className={styles.page_container}>
      <CardDetailHeader card={card} />
      
      <div className={styles.content_wrapper}>
        <div className={styles.actions_section}>
          <Button onClick={() => setIsPinModalOpen(true)}>{t('consult_pin_button')}</Button>
        </div>
        
        <MovementFilters onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} />
        
        <MovementList movements={filteredMovements} />
      </div>

      <PinConsultModal 
        card={card} 
        isOpen={isPinModalOpen} 
        onClose={() => setIsPinModalOpen(false)} 
      />
    </main>
  );
}