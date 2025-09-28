// components/accounts/details/AccountDetailHeader.tsx
import { Account } from '@/lib/types/accounts';
import { formatCurrency } from '@/lib/data/accounts';
import styles from './AccountDetailHeader.module.css';

type Props = { account: Account };

export default function AccountDetailHeader({ account }: Props) {
  return (
    <header className={styles.header}>
      <h1 className={styles.header_title}>{account.alias}</h1>
      <p className={styles.header_subtitle}>
        {account.type} | {account.account_id}
      </p>
      <div className={styles.balance_summary}>
        <p className={styles.balance_label}>Saldo Disponible ({account.currency})</p>
        <p className={styles.balance_value}>
          {formatCurrency(account.balance, account.currency)}
        </p>
      </div>
    </header>
  );
}