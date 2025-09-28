"use client";
import { useTranslations } from 'next-intl'; 
import { useAccounts } from '@/lib/hooks/useAccounts';
import AccountCard from '@/components/accounts/AccountCard';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import Alert from '@/components/alert/alert';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { accounts, loading, error } = useAccounts();
  
  const t = useTranslations('Dashboard');

  const renderContent = () => {
    if (loading) return <div className={styles.feedback_container}><LoadingSpinner /></div>;
    
    if (error) return (
      <div className={styles.feedback_container}>
        <Alert message={error} type='error'>{error}</Alert>
      </div>
    );

    if (accounts.length === 0) return (
      <p className={styles.feedback_container}>
        {t('no_accounts_message')}
      </p>
    );

    return (
      <ul 
        className={styles.accounts_list} 
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
       <h1 className={styles.page_title}>{t('page_title')}</h1>
         {renderContent()}
    </main>
  );
}