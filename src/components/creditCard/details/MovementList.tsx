import { CardMovement } from '@/lib/types/cards';
import { formatCurrency } from '@/lib/data/cards';
import styles from './MovementList.module.css';

// Sub-componente para un solo item de la lista
function MovementItem({ movement }: { movement: CardMovement }) {
  const isPayment = movement.type === 'PAGO';
  const amountClass = isPayment ? styles.amount_payment : styles.amount_purchase;
  const formattedDate = new Date(movement.date).toLocaleDateString('es-CR');

  return (
    <li className={styles.item}>
      <div className={styles.item_details}>
        <p className={styles.item_description}>{movement.description}</p>
        <p className={styles.item_meta}>{formattedDate} | {movement.type}</p>
      </div>
      <p className={`${styles.item_amount} ${amountClass}`}>
        {formatCurrency(movement.amount, movement.currency)}
      </p>
    </li>
  );
}

// Componente principal de la lista
export default function MovementList({ movements }: { movements: CardMovement[] }) {
  if (movements.length === 0) {
    return <p className={styles.no_results}>No hay movimientos que coincidan con los filtros.</p>;
  }

  return (
    <section aria-labelledby="transactions-heading">
      <h2 id="transactions-heading" className={styles.list_title}>Transacciones</h2>
      <ul className={styles.list}>
        {movements.map(movement => <MovementItem key={movement.id} movement={movement} />)}
      </ul>
    </section>
  );
}