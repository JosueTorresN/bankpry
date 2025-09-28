"use client";

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
// 1. Import useTranslations
import { useTranslations } from 'next-intl';
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
  
  // 2. Initialize the translation function, scoped to 'AccountDetails'
  const t = useTranslations('AccountDetails');

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
  
  // Note: The 'error' from the hook is often technical/API error text and is usually 
  // displayed as is, or you'd use a generic translation key here. We'll leave the error
  // display logic untouched for now.
  if (error) return (
    <div className={styles.feedback_container}>
      <Alert message={error} type='error'>
        {error}
      </Alert>
    </div>
  );
  
  // 3. Translate the "Account not found" message
  const accountNotFoundMessage = t('not_found_error');
  if (!account) return (
    <div className={styles.feedback_container}>
      <Alert message={accountNotFoundMessage} type='error'>
        {accountNotFoundMessage}
      </Alert>
    </div>
  );

  // Renderizado de la página principal
  return (
    <main className={styles.page_container}>
      {/* AccountDetailHeader needs to be updated internally */}
      <AccountDetailHeader account={account} />
      
      <div className={styles.content_wrapper}>
        {/* MovementFilters needs to be updated internally */}
        <MovementFilters 
          onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} 
        />
        {/* MovementList needs to be updated internally */}
        <MovementList movements={filteredMovements} />
      </div>
    </main>
  );
}
// // app/dashboard/[accountId]/page.tsx
// "use client";

// import { useState, useMemo } from 'react';
// import { useParams } from 'next/navigation';
// import { useAccountDetails } from '@/lib/hooks/useAccountDetails';
// import AccountDetailHeader from '@/components/accounts/details/AccountDetailHeader';
// import MovementFilters from '@/components/accounts/details/MovementFilters';
// import MovementList from '@/components/accounts/details/MovementList';
// import LoadingSpinner from '@/components/feedBack/loadingSpineer';
// import Alert from '@/components/alert/alert';
// import styles from './AccountDetailPage.module.css';

// export default function AccountDetailPage() {
//   const params = useParams();
//   const accountId = params.accountId as string;
  
//   // 1. Obtiene los datos con el hook
//   const { account, movements, loading, error } = useAccountDetails(accountId);
  
//   // 2. Maneja el estado de los filtros
//   const [filters, setFilters] = useState({ searchText: '', filterType: 'TODOS' });

//   // 3. La lógica de filtrado sigue aquí, simple y clara
//   const filteredMovements = useMemo(() => {
//     return movements
//       .filter(m => filters.filterType === 'TODOS' || m.type === filters.filterType)
//       .filter(m => m.description.toLowerCase().includes(filters.searchText.toLowerCase()));
//   }, [movements, filters]);

//   // Renderizado de estados de carga y error
//   if (loading) return <div className={styles.feedback_container}><LoadingSpinner /></div>;
//   if (error) return (
//     <div className={styles.feedback_container}>
//       <Alert message={error} type='error'>
//         {error}
//       </Alert>
//     </div>
//   );
//   if (!account) return (
//     <div className={styles.feedback_container}>
//       <Alert message="Cuenta no encontrada." type='error'>
//         Cuenta no encontrada.
//       </Alert>
//     </div>
//   );

//   // Renderizado de la página principal
//   return (
//     <main className={styles.page_container}>
//       <AccountDetailHeader account={account} />
      
//       <div className={styles.content_wrapper}>
//         <MovementFilters 
//           onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} 
//         />
//         <MovementList movements={filteredMovements} />
//       </div>
//     </main>
//   );
// }