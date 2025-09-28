// app/dashboard/page.tsx
"use client";
import { useAccounts } from '@/lib/hooks/useAccounts';
import AccountCard from '@/components/accounts/AccountCard';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import Alert from '@/components/alert/alert';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { accounts, loading, error } = useAccounts();

  const renderContent = () => {
    if (loading) return <div className={styles.feedback_container}><LoadingSpinner /></div>;
    if (error) return (
      <div className={styles.feedback_container}>
        <Alert message={error} type='error'>{error}</Alert>
      </div>
    );
    if (accounts.length === 0) return <p className={styles.feedback_container}>No tienes cuentas disponibles.</p>;

    return (
      <ul className={styles.accounts_list} aria-label="Lista de sus cuentas bancarias">
        {accounts.map((account) => (
          <AccountCard key={account.account_id} account={account} />
        ))}
      </ul>
    );
  };

  return (
    <main className={styles.page_container}>
      <h1 className={styles.page_title}>Tus Cuentas</h1>
      {renderContent()}
    </main>
  );
}