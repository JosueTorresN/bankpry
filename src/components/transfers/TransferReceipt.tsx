import { TransferFormValues } from '@/lib/validations/transferSchema';
import { formatCurrency } from '@/lib/data/accounts';
import { MOCK_ACCOUNTS } from '@/lib/data/accounts';
import Button from '@/components/button/button';
import styles from './Transfers.module.css';

type Props = {
  receipt: { transactionId: string } & TransferFormValues;
  onNewTransfer: () => void;
};

export default function TransferReceipt({ receipt, onNewTransfer }: Props) {
  
  const handleDownload = () => {
    const receiptText = `
      ================================
      COMPROBANTE DE TRANSFERENCIA
      ================================
      ID de Transacción: ${receipt.transactionId}
      Fecha: ${new Date().toLocaleString('es-CR')}
      
      CUENTA ORIGEN
      ID: ${receipt.sourceAccountId}
      
      CUENTA DESTINO
      ID: ${receipt.targetAccountId}
      Titular: ${receipt.targetOwner || 'Cuenta Propia'}
      
      DETALLES
      Monto: ${formatCurrency(receipt.amount, MOCK_ACCOUNTS.find(a => a.account_id === receipt.sourceAccountId)?.currency || 'CRC')}
      Descripción: ${receipt.description || 'N/A'}
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
      <h2 className={styles.receipt_title}>Transferencia Exitosa</h2>
      <p className={styles.receipt_subtitle}>
        Se ha enviado {formatCurrency(receipt.amount, MOCK_ACCOUNTS.find(a => a.account_id === receipt.sourceAccountId)?.currency || 'CRC')} a {receipt.targetOwner || 'tu otra cuenta'}.
      </p>
      
      <div className={styles.receipt_details}>
        <div className={styles.detail_item}>
          <span>ID de Transacción</span>
          <p>{receipt.transactionId}</p>
        </div>
         {/* Puedes añadir más detalles aquí si lo deseas */}
      </div>

      <div className={styles.receipt_actions}>
        <Button onClick={handleDownload} variant="secondary">Descargar Comprobante</Button>
        <Button onClick={onNewTransfer}>Realizar Nueva Transferencia</Button>
      </div>
    </div>
  );
}