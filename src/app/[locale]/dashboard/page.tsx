"use client";
// 1. Import the useTranslations hook
import { useTranslations } from 'next-intl'; 
import { useAccounts } from '@/lib/hooks/useAccounts';
import AccountCard from '@/components/accounts/AccountCard';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import Alert from '@/components/alert/alert';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { accounts, loading, error } = useAccounts();
  
  // 2. Initialize the translation function, scoped to 'Dashboard'
  const t = useTranslations('Dashboard');

  const renderContent = () => {
    if (loading) return <div className={styles.feedback_container}><LoadingSpinner /></div>;
    
    // The Alert component's 'message' prop probably needs translation inside Alert.tsx, 
    // but the error message itself is passed from the hook. We'll leave the Alert message as is.
    if (error) return (
      <div className={styles.feedback_container}>
        <Alert message={error} type='error'>{error}</Alert>
      </div>
    );

    // 3. Translate the 'No accounts' message
    if (accounts.length === 0) return (
      <p className={styles.feedback_container}>
        {t('no_accounts_message')}
      </p>
    );

    return (
      <ul 
        className={styles.accounts_list} 
        // 4. Translate the accessibility label
        aria-label={t('accounts_list_aria_label')}
      >
        {accounts.map((account) => (
          <AccountCard key={account.account_id} account={account} />
        ))}
      </ul>
    );
  };

  return (
    <main className={styles.page_container}>
      {/* 5. Translate the page title */}
      <h1 className={styles.page_title}>{t('page_title')}</h1>
      {renderContent()}
    </main>
  );
}

// // app/dashboard/page.tsx
// "use client";
// import { useAccounts } from '@/lib/hooks/useAccounts';
// import AccountCard from '@/components/accounts/AccountCard';
// import LoadingSpinner from '@/components/feedBack/loadingSpineer';
// import Alert from '@/components/alert/alert';
// import styles from './DashboardPage.module.css';

// export default function DashboardPage() {
//   const { accounts, loading, error } = useAccounts();

//   const renderContent = () => {
//     if (loading) return <div className={styles.feedback_container}><LoadingSpinner /></div>;
//     if (error) return (
//       <div className={styles.feedback_container}>
//         <Alert message={error} type='error'>{error}</Alert>
//       </div>
//     );
//     if (accounts.length === 0) return <p className={styles.feedback_container}>No tienes cuentas disponibles.</p>;

//     return (
//       <ul className={styles.accounts_list} aria-label="Lista de sus cuentas bancarias">
//         {accounts.map((account) => (
//           <AccountCard key={account.account_id} account={account} />
//         ))}
//       </ul>
//     );
//   };

//   return (
//     <main className={styles.page_container}>
//       <h1 className={styles.page_title}>Tus Cuentas</h1>
//       {renderContent()}
//     </main>
//   );
// }