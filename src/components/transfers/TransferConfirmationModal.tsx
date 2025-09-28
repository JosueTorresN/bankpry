import Modal from '@/components/modal/Modal';
import Button from '@/components/button/button';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import { TransferFormValues } from '@/lib/validations/transferSchema';
import { formatCurrency } from '@/lib/data/accounts';
import { MOCK_ACCOUNTS } from '@/lib/data/accounts';
import { Account } from '@/lib/types/accounts';
import styles from './Transfers.module.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  data: TransferFormValues;
  sourceAccount?: Account;
};

export default function TransferConfirmationModal({ isOpen, onClose, onConfirm, isSubmitting, data, sourceAccount }: Props) {
  if (!sourceAccount) return null;

  const targetAlias = data.transferType === 'PROPIAS' 
    ? MOCK_ACCOUNTS.find(a => a.account_id === data.targetAccountId)?.alias 
    : data.targetOwner;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Transferencia">
      <div className={styles.confirmation_details}>
        <div className={styles.detail_item}>
          <span>Desde</span>
          <p>{sourceAccount.alias} ({sourceAccount.currency})</p>
        </div>
        <div className={styles.detail_item}>
          <span>Hacia</span>
          <p>{targetAlias}</p>
          <small>{data.targetAccountId}</small>
        </div>
        <div className={styles.detail_item_amount}>
          <span>Monto</span>
          <p>{formatCurrency(data.amount, sourceAccount.currency)}</p>
        </div>
        {data.description && (
          <div className={styles.detail_item}>
            <span>Descripción</span>
            <p>{data.description}</p>
          </div>
        )}
      </div>
      <div className={styles.confirmation_actions}>
        <Button onClick={onClose} variant="secondary" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner /> : 'Confirmar y Enviar'}
        </Button>
      </div>
    </Modal>
  );
}