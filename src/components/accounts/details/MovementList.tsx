// components/accounts/details/MovementList.tsx
import { Movement } from '@/lib/types/accounts';
import { formatCurrency } from '@/lib/data/accounts';
import styles from './MovementList.module.css';

// Sub-componente para un solo item, ahora es un <li>
function MovementItem({ movement }: { movement: Movement }) {
  const isCredit = movement.type === 'CREDITO';
  const sign = isCredit ? '+' : '-';
  const amountClass = isCredit ? styles.amount_credit : styles.amount_debit;
  const formattedDate = new Date(movement.date).toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <li className={styles.item}>
      <div className={styles.item_details}>
        <p className={styles.item_description}>{movement.description}</p>
        <p className={styles.item_meta}>{formattedDate} | {movement.type}</p>
      </div>
      <p className={`${styles.item_amount} ${amountClass}`}>
        {sign} {formatCurrency(Math.abs(movement.amount), movement.currency)}
      </p>
    </li>
  );
}

// Componente principal de la lista
export default function MovementList({ movements }: { movements: Movement[] }) {
  if (movements.length === 0) {
    return <p className={styles.no_results}>No se encontraron movimientos.</p>;
  }

  return (
    <section aria-labelledby="transactions-heading">
      <h2 id="transactions-heading" className={styles.list_title}>Historial</h2>
      <ul className={styles.list}>
        {movements.map(movement => <MovementItem key={movement.id} movement={movement} />)}
      </ul>
    </section>
  );
}