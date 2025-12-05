"use client";

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

// Hooks y Tipos
import { useCardDetails } from '@/lib/hooks/useCardDetails';
import { CardMovement } from '@/lib/types/cards';

// Componentes
import CardDetailHeader from '@/components/creditCard/details/CardDetailHeader';
import MovementFilters from '@/components/creditCard/details/MovementFilters';
import MovementList from '@/components/creditCard/details/MovementList';
import Button from '@/components/button/button';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import Alert from '@/components/alert/alert';
import PinConsultModal from '@/components/modalConsults/PinConsultModal';

import styles from './CardDetailPage.module.css';

export default function CardDetailPage() {
  const params = useParams();
  const cardId = params.cardId as string;
  const t = useTranslations('CardDetails');

  // 1. Consumo del Hook personalizado
  const { card, movements, loading, error } = useCardDetails(cardId);
  
  // 2. Estado local
  const [filters, setFilters] = useState({ 
    searchText: '', 
    filterType: 'TODOS' 
  });
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // 3. Lógica de Filtrado (Optimizada con useMemo)
  const filteredMovements = useMemo(() => {
    if (!movements) return [];

    return movements.filter((m: CardMovement) => {
      // Filtro por Tipo (COMPRA / PAGO / TODOS)
      const matchesType = filters.filterType === 'TODOS' || m.type === filters.filterType;
      
      // Filtro por Texto
      const matchesText = m.description.toLowerCase().includes(filters.searchText.toLowerCase());

      return matchesType && matchesText;
    });
  }, [movements, filters]);

  // Handler para actualizar filtros
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // 4. Renderizado condicional de estados de carga/error
  if (loading) {
    return (
      <div className={styles.centered_feedback}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centered_feedback}>
        <Alert message={error} type='error'>
          {error}
        </Alert>
      </div>
    );
  }

  if (!card) {
    return (
      <div className={styles.centered_feedback}>
        <Alert message="Tarjeta no encontrada" type='error'>
          {t('not_found_error')}
        </Alert>
      </div>
    );
  }

  // 5. Renderizado Principal
  return (
    <main className={styles.page_container}>
      {/* Cabecera de la tarjeta (Saldo, Número, etc.) */}
      <CardDetailHeader card={card} />
      
      <div className={styles.content_wrapper}>
        {/* Botonera de acciones */}
        <div className={styles.actions_section}>
          <Button onClick={() => setIsPinModalOpen(true)}>
            {t('consult_pin_button')}
          </Button>
        </div>
        
        {/* Filtros de búsqueda */}
        <MovementFilters onFilterChange={handleFilterChange} />
        
        {/* Lista de movimientos filtrada */}
        <MovementList movements={filteredMovements} />
      </div>

      {/* Modal de consulta de PIN */}
      <PinConsultModal 
        card={card} 
        isOpen={isPinModalOpen} 
        onClose={() => setIsPinModalOpen(false)} 
      />
    </main>
  );
}

// import { useState, useMemo } from 'react';
// import { useParams } from 'next/navigation';
// import { useCardDetails } from '@/lib/hooks/useCardDetails';
// import CardDetailHeader from '@/components/creditCard/details/CardDetailHeader';
// import MovementFilters from '@/components/creditCard/details/MovementFilters';
// import MovementList from '@/components/creditCard/details/MovementList';
// import Button from '@/components/button/button';
// import LoadingSpinner from '@/components/feedBack/loadingSpineer';
// import Alert from '@/components/alert/alert';
// import PinConsultModal from '@/components/modalConsults/PinConsultModal';
// import styles from './CardDetailPage.module.css';
// import { useTranslations } from 'next-intl';
// export default function CardDetailPage() {
//   const params = useParams();
//   const cardId = params.cardId as string;
//   const t = useTranslations('CardDetails');
//   // Usamos el hook para obtener los datos
//   const { card, movements, loading, error } = useCardDetails(cardId);
  
//   // Estado para filtros y modal
//   const [filters, setFilters] = useState({ searchText: '', filterType: 'TODOS' });
//   const [isPinModalOpen, setIsPinModalOpen] = useState(false);

//   // Lógica de filtrado con useMemo
//   const filteredMovements = useMemo(() => {
//     return movements
//       .filter(m => filters.filterType === 'TODOS' || m.type === filters.filterType)
//       .filter(m => m.description.toLowerCase().includes(filters.searchText.toLowerCase()));
//   }, [movements, filters]);

//   if (loading) return <div className={styles.centered_feedback}><LoadingSpinner /></div>;
//   if (error) return (
//     <div className={styles.centered_feedback}>
//       <Alert message={error} type='error'>{error}</Alert>
//     </div>
//   );
//   if (!card) return (
//     <div className={styles.centered_feedback}>
//       <Alert message="Tarjeta no encontrada." type='error'>
//         {t('not_found_erro')}
//       </Alert>
//     </div>
//   );

//   return (
//     <main className={styles.page_container}>
//       <CardDetailHeader card={card} />
      
//       <div className={styles.content_wrapper}>
//         <div className={styles.actions_section}>
//           <Button onClick={() => setIsPinModalOpen(true)}>{t('consult_pin_button')}</Button>
//         </div>
        
//         <MovementFilters onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} />
        
//         <MovementList movements={filteredMovements} />
//       </div>

//       <PinConsultModal 
//         card={card} 
//         isOpen={isPinModalOpen} 
//         onClose={() => setIsPinModalOpen(false)} 
//       />
//     </main>
//   );
// }