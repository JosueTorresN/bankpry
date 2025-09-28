// app/dashboard/[accountId]/page.tsx
"use client";

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAccountDetails } from '@/lib/hooks/useAccountDetails';
import AccountDetailHeader from '@/components/accounts/details/AccountDetailHeader';
import MovementFilters from '@/components/accounts/details/MovementFilters';
import MovementList from '@/components/accounts/details/MovementList';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import Alert from '@/components/alert/alert';
import styles from './AccountDetailPage.module.css';

export default function AccountDetailPage() {
  const params = useParams();
  const accountId = params.accountId as string;
  
  // 1. Obtiene los datos con el hook
  const { account, movements, loading, error } = useAccountDetails(accountId);
  
  // 2. Maneja el estado de los filtros
  const [filters, setFilters] = useState({ searchText: '', filterType: 'TODOS' });

  // 3. La lógica de filtrado sigue aquí, simple y clara
  const filteredMovements = useMemo(() => {
    return movements
      .filter(m => filters.filterType === 'TODOS' || m.type === filters.filterType)
      .filter(m => m.description.toLowerCase().includes(filters.searchText.toLowerCase()));
  }, [movements, filters]);

  // Renderizado de estados de carga y error
  if (loading) return <div className={styles.feedback_container}><LoadingSpinner /></div>;
  if (error) return (
    <div className={styles.feedback_container}>
      <Alert message={error} type='error'>
        {error}
      </Alert>
    </div>
  );
  if (!account) return (
    <div className={styles.feedback_container}>
      <Alert message="Cuenta no encontrada." type='error'>
        Cuenta no encontrada.
      </Alert>
    </div>
  );

  // Renderizado de la página principal
  return (
    <main className={styles.page_container}>
      <AccountDetailHeader account={account} />
      
      <div className={styles.content_wrapper}>
        <MovementFilters 
          onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} 
        />
        <MovementList movements={filteredMovements} />
      </div>
    </main>
  );
}