// app/(dashboard)/transfers/page.tsx (o donde esté tu archivo page.tsx)
"use client";

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { TransferFormValues } from '@/lib/validations/transferSchema';
// Importamos el nuevo servicio
import { performInternalTransfer } from '@/services/transfers'; 

import TransferTypeSwitcher from '@/components/transfers/TransferTypeSwitcher';
import TransferForm from '@/components/forms/transfers/TransferForm';
import TransferConfirmationModal from '@/components/transfers/TransferConfirmationModal';
import TransferReceipt from '@/components/transfers/TransferReceipt';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import Alert from '@/components/alert/alert'; // Importar si deseas mostrar errores en pantalla
import styles from './TransfersPage.module.css';

// Helper para obtener token (igual que en los otros hooks)
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
  const [error, setError] = useState<string | null>(null); // Estado para errores

  const handleFormSubmit = (data: TransferFormValues) => {
    setError(null); // Limpiar errores previos
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
        // 1. Buscamos la cuenta origen para saber su moneda (CRC/USD)
        const sourceAccount = accounts.find(a => a.account_id === transferData.sourceAccountId);
        const currencyCode = sourceAccount?.currency || 'CRC';

        // 2. Llamada REAL al backend
        const result = await performInternalTransfer(transferData, currencyCode, token);
        
        // 3. Crear datos para el recibo con la respuesta real del backend
        const finalReceipt = {
            transactionId: result.receipt_number, // Usamos el número de recibo real
            date: new Date().toISOString(),
            ...transferData
        };

        setReceiptData(finalReceipt);
        setPageState('RECEIPT');

    } catch (err: any) {
        console.error("Transfer error:", err);
        setError(err.message || "Falló la transferencia.");
        // Opcional: Cerrar modal o mantenerlo abierto para reintentar
        setPageState('FORM'); // Regresamos al form para que vea el error
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