import { TransferFormValues } from '@/lib/validations/transferSchema';
import { formatCurrency } from '@/lib/data/accounts';
import { MOCK_ACCOUNTS } from '@/lib/data/accounts';
import Button from '@/components/button/button';
import styles from './Transfers.module.css';
import { useTranslations } from 'next-intl';

type Props = {
  receipt: { transactionId: string } & TransferFormValues;
  onNewTransfer: () => void;
};

export default function TransferReceipt({ receipt, onNewTransfer }: Props) {
  const t = useTranslations('Transfers');
  const handleDownload = () => {
    const receiptText = `
      ================================
      ${t('receipt_download_title')}
      ================================
      ${t('receipt_id_label')}: ${receipt.transactionId}
      ${t('receipt_date_label')}: ${new Date().toLocaleString('es-CR')}
      
      ${t('receipt_source_account_title')}
      ${t('receipt_id_short_label')}: ${receipt.sourceAccountId}
      
      ${t('receipt_target_account_title')}
      ${t('receipt_id_short_label')}: ${receipt.targetAccountId}
      ${t('receipt_owner_label')}: ${receipt.targetOwner || t('receipt_default_owner')}
      
      ${t('receipt_details_title')}
      ${t('receipt_amount_label')}: ${formatCurrency(receipt.amount, MOCK_ACCOUNTS.find(a => a.account_id === receipt.sourceAccountId)?.currency || 'CRC')}
      ${t('receipt_description_label')} || 'N/A'}
      ================================
    `;

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprobante-${receipt.transactionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.receipt_container}>
      <div className={styles.receipt_icon}>✅</div>
      <h2 className={styles.receipt_title}>{t('receipt_success_title')}</h2>
      <p className={styles.receipt_subtitle}>
        {t('receipt_success_subtitle')} {formatCurrency(receipt.amount, MOCK_ACCOUNTS.find(a => a.account_id === receipt.sourceAccountId)?.currency || 'CRC')} {t('receipt_success_subtitle2')} {receipt.targetOwner || `${t('receipt_default_target')}`}.
      </p>
      
      <div className={styles.receipt_details}>
        <div className={styles.detail_item}>
          <span>{t('receipt_id_label')}</span>
          <p>{receipt.transactionId}</p>
        </div>
      </div>

      <div className={styles.receipt_actions}>
        <Button onClick={handleDownload} variant="secondary">{t('download_receipt_button')}</Button>
        <Button onClick={onNewTransfer}>{t('new_transfer_button')}</Button>
      </div>
    </div>
  );
}