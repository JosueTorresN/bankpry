"use client";

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { TransferFormValues } from '@/lib/validations/transferSchema';
import { performInternalTransfer, performInterbankTransfer } from '@/services/transfers';

import TransferTypeSwitcher from '@/components/transfers/TransferTypeSwitcher';
import TransferForm from '@/components/forms/transfers/TransferForm';
import TransferConfirmationModal from '@/components/transfers/TransferConfirmationModal';
import TransferReceipt from '@/components/transfers/TransferReceipt';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import Alert from '@/components/alert/alert';
import styles from './TransfersPage.module.css';

const useAuthToken = () => typeof window !== 'undefined' ? localStorage.getItem("TOKEN") : null;

type PageState = 'FORM' | 'CONFIRMING' | 'RECEIPT';

export default function TransfersPage() {
  const t = useTranslations('Transfers'); 
  const { accounts, loading } = useAccounts();
  const token = useAuthToken();

  const [pageState, setPageState] = useState<PageState>('FORM');
  const [transferType, setTransferType] = useState<'PROPIAS' | 'TERCEROS'>('PROPIAS');
  const [transferData, setTransferData] = useState<TransferFormValues | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = (data: TransferFormValues) => {
    setError(null);
    setTransferData(data);
    setPageState('CONFIRMING');
  };

  const handleConfirmTransfer = async () => {
    if (!transferData || !token) {
        setError("Sesión no válida o datos incompletos.");
        return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
        const sourceAccount = accounts.find(a => a.id === transferData.sourceAccountId);
        const currencyCode = sourceAccount?.currency || 'CRC';

        let result;
        console.log("Iniciando transferencia con datos:", transferData.transferType , "y moneda:", currencyCode);
        if (transferType === 'TERCEROS') {
            result = await performInterbankTransfer(transferData, currencyCode, token);
        } else {
            result = await performInternalTransfer(transferData, currencyCode, token);
        }
        
        const finalReceipt = {
            transactionId: result.receipt_number,
            date: new Date().toISOString(),
            currency: currencyCode,
            ...transferData
        };

        setReceiptData(finalReceipt);
        setPageState('RECEIPT');

    } catch (err: any) {
        console.error("Transfer error:", err);
        setError(err.message || "Falló la transferencia.");
        setPageState('FORM'); 
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const resetFlow = () => {
    setPageState('FORM');
    setTransferData(null);
    setReceiptData(null);
    setError(null);
  };
  
  if (loading) {
    return <main className={styles.page_container}><div className={styles.feedback_container}><LoadingSpinner /></div></main>;
  }

  return (
    <main className={styles.page_container}>
      {/* Mostrar Error si existe en la parte superior */}
      {error && (
        <div className={styles.error_container} style={{ marginBottom: '1rem' }}>
             <Alert message={error} type="error">{error}</Alert>
        </div>
      )}

      {pageState === 'RECEIPT' ? (
        <TransferReceipt receipt={receiptData} onNewTransfer={resetFlow} accounts={accounts} />
      ) : (
        <>
          <h1 className={styles.page_title}>{t('page_title')}</h1>
          <TransferTypeSwitcher currentType={transferType} onTypeChange={setTransferType} />
          <TransferForm 
            userAccounts={accounts} 
            initialType={transferType}
            onTypeChange={setTransferType}
            onSubmit={handleFormSubmit}
            token={token || ''}
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
          sourceAccount={accounts.find(a => a.id === transferData.sourceAccountId)}
          accounts={accounts}
        />
      )}
    </main>
  );
}

// "use client";

// import { useTranslations } from 'next-intl';
// import { useState } from 'react';
// import { useAccounts } from '@/lib/hooks/useAccounts';
// import { TransferFormValues } from '@/lib/validations/transferSchema';
// import TransferTypeSwitcher from '@/components/transfers/TransferTypeSwitcher';
// import TransferForm from '@/components/forms/transfers/TransferForm';
// import TransferConfirmationModal from '@/components/transfers/TransferConfirmationModal';
// import TransferReceipt from '@/components/transfers/TransferReceipt';
// import LoadingSpinner from '@/components/feedBack/loadingSpineer';
// import styles from './TransfersPage.module.css';

// type PageState = 'FORM' | 'CONFIRMING' | 'RECEIPT';

// export default function TransfersPage() {
//   const t = useTranslations('Transfers'); 

//   const { accounts, loading } = useAccounts();
//   const [pageState, setPageState] = useState<PageState>('FORM');
//   const [transferType, setTransferType] = useState<'PROPIAS' | 'TERCEROS'>('PROPIAS');
//   const [transferData, setTransferData] = useState<TransferFormValues | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [receiptData, setReceiptData] = useState<any>(null);

//   const handleFormSubmit = (data: TransferFormValues) => {
//     setTransferData(data);
//     setPageState('CONFIRMING');
//   };

//   const handleConfirmTransfer = async () => {
//     if (!transferData) return;
    
//     setIsSubmitting(true);
//     await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API
    
//     const finalReceipt = {
//       transactionId: `TX-${Date.now()}`,
//       ...transferData
//     };
//     setReceiptData(finalReceipt);
//     setIsSubmitting(false);
//     setPageState('RECEIPT');
//   };
  
//   const resetFlow = () => {
//     setPageState('FORM');
//     setTransferData(null);
//     setReceiptData(null);
//   };
  
//   if (loading) {
//     return <main className={styles.page_container}><div className={styles.feedback_container}><LoadingSpinner /></div></main>;
//   }

//   return (
//     <main className={styles.page_container}>
//       {pageState === 'RECEIPT' ? (
//         <TransferReceipt receipt={receiptData} onNewTransfer={resetFlow} />
//       ) : (
//         <>
//           <h1 className={styles.page_title}>{t('page_title')}</h1>
//           <TransferTypeSwitcher currentType={transferType} onTypeChange={setTransferType} />
//           <TransferForm 
//             userAccounts={accounts} 
//             initialType={transferType}
//             onTypeChange={setTransferType}
//             onSubmit={handleFormSubmit}
//           />
//         </>
//       )}

//       {transferData && (
//         <TransferConfirmationModal
//           isOpen={pageState === 'CONFIRMING'}
//           onClose={() => setPageState('FORM')}
//           onConfirm={handleConfirmTransfer}
//           isSubmitting={isSubmitting}
//           data={transferData}
//           sourceAccount={accounts.find(a => a.account_id === transferData.sourceAccountId)}
//         />
//       )}
//     </main>
//   );
// }