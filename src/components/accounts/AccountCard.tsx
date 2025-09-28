// components/accounts/AccountCard.tsx
"use client";
import { useRouter } from 'next/navigation';
import { Account } from '@/lib/types/accounts';
import { formatCurrency } from '@/lib/data/accounts';
import Button from '@/components/button/button';
import Tag from '@/components/tag/Tag';
import styles from './AccountCard.module.css';

type AccountCardProps = {
  account: Account;
};

export default function AccountCard({ account }: AccountCardProps) {
  const router = useRouter();
  const handleViewDetails = () => router.push(`/dashboard/${account.account_id}`);
  
  // Para accesibilidad, proveemos una descripción más clara
  const accountNumberDescription = `Cuenta ${account.type} terminada en ${account.account_id.slice(-4)}`;

  return (
    <li className={styles.card}>
      <article aria-labelledby={`account-alias-${account.account_id}`}>
        <header className={styles.card_header}>
          <div>
            <h2 id={`account-alias-${account.account_id}`} className={styles.alias}>{account.alias}</h2>
            <p className={styles.details}>{accountNumberDescription}</p>
          </div>
          <Tag label={account.currency} variant={account.currency === 'CRC' ? 'success' : 'info'} />
        </header>

        <div className={styles.balance_section}>
          <p className={styles.balance_label}>Saldo Disponible</p>
          <p className={styles.balance_value}>{formatCurrency(account.balance, account.currency)}</p>
        </div>

        <footer className={styles.card_footer}>
          <Button onClick={handleViewDetails}>Ver Detalles</Button>
        </footer>
      </article>
    </li>
  );
}