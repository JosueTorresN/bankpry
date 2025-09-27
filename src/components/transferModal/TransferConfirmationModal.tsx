import React, { useState } from 'react';
import { Account, Currency, TransferReceipt } from '@/props/account';

// Tipos para la información a mostrar en la modal
interface ModalData {
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
  currency: Currency;
  description: string;
}

interface TransferConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  formData: ModalData;
  sourceAccount: Account;
  targetOwner: string | null;
  transferType: 'PROPIAS' | 'TERCEROS';
  receipt: TransferReceipt | null; // El comprobante generado
}

const TransferConfirmationModal: React.FC<TransferConfirmationModalProps> = ({
  isOpen, onClose, onConfirm, isSubmitting, formData, sourceAccount, targetOwner, transferType, receipt
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number, currency: Currency) => {
    const locale = currency === 'CRC' ? 'es-CR' : 'en-US';
    const style = 'currency';
    const currencyCode = currency;
    return new Intl.NumberFormat(locale, { style, currency: currencyCode }).format(amount);
  };
  
  const handleDownload = () => {
    if (!receipt) return;
    const details = 
      `--- COMPROBANTE DE TRANSFERENCIA ---\n` +
      `ID Transacción: ${receipt.transactionId}\n` +
      `Fecha/Hora: ${new Date(receipt.timestamp).toLocaleString()}\n` +
      `Cuenta Origen: ${receipt.sourceAccount.slice(-4)}\n` +
      `Cuenta Destino: ${receipt.targetAccount.slice(-4)} (${receipt.targetOwner})\n` +
      `Monto: ${formatCurrency(receipt.amount, receipt.currency)}\n` +
      `Descripción: ${receipt.description}\n` +
      `------------------------------------`;
      
    // Simula la descarga
    const element = document.createElement("a");
    const file = new Blob([details], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `comprobante_transferencia_${receipt.transactionId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getTargetLabel = () => {
    if (transferType === 'PROPIAS') {
      return `Cuenta Propia (${formData.targetAccountId.slice(-4)})`;
    }
    return `${targetOwner || 'Tercero Desconocido'} (${formData.targetAccountId.slice(-4)})`;
  };

  const Content = () => {
    // 5. Ver el resultado y el comprobante
    if (receipt) {
      return (
        <div className="text-center p-4">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="text-xl font-bold mt-2 text-green-700">¡Transferencia Exitosa!</h3>
          <p className="text-sm text-gray-500 mt-1">ID: {receipt.transactionId}</p>
          
          <div className="mt-4 text-left p-3 bg-gray-50 rounded-lg space-y-2 text-sm">
            <p><strong>Monto:</strong> <span className="float-right font-semibold">{formatCurrency(receipt.amount, receipt.currency)}</span></p>
            <p><strong>Destino:</strong> <span className="float-right">{receipt.targetOwner}</span></p>
            <p><strong>Fecha:</strong> <span className="float-right">{new Date(receipt.timestamp).toLocaleString()}</span></p>
          </div>
          
          <div className="mt-6 flex flex-col space-y-2">
            <button 
              onClick={handleDownload} 
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Descargar Comprobante
            </button>
            <button 
              onClick={onClose} 
              className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      );
    }
    
    // 3. Pantalla de Confirmación
    return (
      <div className="text-left">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Revisa y Confirma la Operación</h3>
        
        {/* Resumen de la Operación */}
        <div className="p-4 bg-yellow-50 rounded-lg space-y-2 text-sm mb-4">
          <p><strong>Monto a Enviar:</strong> <span className="float-right text-lg font-bold text-red-600">{formatCurrency(formData.amount, formData.currency)}</span></p>
          <p><strong>Origen:</strong> <span className="float-right">{sourceAccount.alias} ({sourceAccount.account_id.slice(-4)})</span></p>
          <p><strong>Destino:</strong> <span className="float-right font-medium">{getTargetLabel()}</span></p>
          <p><strong>Descripción:</strong> <span className="float-right italic">{formData.description || 'N/A'}</span></p>
        </div>
        
        {/* Botones de Confirmación */}
        <div className="flex space-x-3">
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`flex-1 py-3 rounded-lg text-white font-semibold transition duration-150 ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Transfiriendo...' : 'Confirmar Transferencia'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
        {Content()}
      </div>
    </div>
  );
};

export default TransferConfirmationModal;