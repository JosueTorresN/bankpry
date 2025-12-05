import Modal from '@/components/modal/Modal';
import Button from '@/components/button/button';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import { TransferFormValues } from '@/lib/validations/transferSchema';
import { formatCurrency } from '@/lib/data/accounts';
import { Account } from '@/lib/types/accounts';
import styles from './Transfers.module.css';
import { useTranslations } from 'next-intl';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  data: TransferFormValues;
  sourceAccount?: Account;
  accounts: Account[];
};

export default function TransferConfirmationModal({ isOpen, onClose, onConfirm, isSubmitting, data, sourceAccount, accounts }: Props) {
   const t = useTranslations('Transfers');
  if (!sourceAccount) return null;

  const targetAlias = data.transferType === 'PROPIAS' 
    ? accounts.find(a => a.id === data.targetAccountId)?.alias 
    : data.targetOwner;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('confirmation_modal_title')}>
      <div className={styles.confirmation_details}>
        <div className={styles.detail_item}>
          <span>{t('label_from')}</span>
          <p>{sourceAccount.alias} ({sourceAccount.currency})</p>
        </div>
        <div className={styles.detail_item}>
          <span>{t('label_to')}</span>
          <p>{targetAlias}</p>
          <small>{data.targetAccountId}</small>
        </div>
        <div className={styles.detail_item_amount}>
          <span>{t('label_amount')}</span>
          <p>{formatCurrency(data.amount, sourceAccount.currency)}</p>
        </div>
        {data.description && (
          <div className={styles.detail_item}>
            <span>{t('label_description')}</span>
            <p>{data.description}</p>
          </div>
        )}
      </div>
      <div className={styles.confirmation_actions}>
        <Button onClick={onClose} variant="secondary" disabled={isSubmitting}>
          {t('cancel_button')}
        </Button>
        <Button onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner /> : t('confirm_send_button')}
        </Button>
      </div>
    </Modal>
  );
}