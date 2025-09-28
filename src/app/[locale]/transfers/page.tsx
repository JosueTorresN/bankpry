"use client";

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { TransferFormValues } from '@/lib/validations/transferSchema';
import TransferTypeSwitcher from '@/components/transfers/TransferTypeSwitcher';
import TransferForm from '@/components/forms/transfers/TransferForm';
import TransferConfirmationModal from '@/components/transfers/TransferConfirmationModal';
import TransferReceipt from '@/components/transfers/TransferReceipt';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import styles from './TransfersPage.module.css';

type PageState = 'FORM' | 'CONFIRMING' | 'RECEIPT';

export default function TransfersPage() {
  const t = useTranslations('Transfers'); 

  const { accounts, loading } = useAccounts();
  const [pageState, setPageState] = useState<PageState>('FORM');
  const [transferType, setTransferType] = useState<'PROPIAS' | 'TERCEROS'>('PROPIAS');
  const [transferData, setTransferData] = useState<TransferFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const handleFormSubmit = (data: TransferFormValues) => {
    setTransferData(data);
    setPageState('CONFIRMING');
  };

  const handleConfirmTransfer = async () => {
    if (!transferData) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API
    
    const finalReceipt = {
      transactionId: `TX-${Date.now()}`,
      ...transferData
    };
    setReceiptData(finalReceipt);
    setIsSubmitting(false);
    setPageState('RECEIPT');
  };
  
  const resetFlow = () => {
    setPageState('FORM');
    setTransferData(null);
    setReceiptData(null);
  };
  
  if (loading) {
    return <main className={styles.page_container}><div className={styles.feedback_container}><LoadingSpinner /></div></main>;
  }

  return (
    <main className={styles.page_container}>
      {pageState === 'RECEIPT' ? (
        <TransferReceipt receipt={receiptData} onNewTransfer={resetFlow} />
      ) : (
        <>
          <h1 className={styles.page_title}>{t('page_title')}</h1>
          <TransferTypeSwitcher currentType={transferType} onTypeChange={setTransferType} />
          <TransferForm 
            userAccounts={accounts} 
            initialType={transferType}
            onTypeChange={setTransferType}
            onSubmit={handleFormSubmit}
          />
        </>
      )}

      {transferData && (
        <TransferConfirmationModal
          isOpen={pageState === 'CONFIRMING'}
          onClose={() => setPageState('FORM')}
          onConfirm={handleConfirmTransfer}
          isSubmitting={isSubmitting}
          data={transferData}
          sourceAccount={accounts.find(a => a.account_id === transferData.sourceAccountId)}
        />
      )}
    </main>
  );
}