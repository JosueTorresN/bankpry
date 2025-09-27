'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { MOCK_ACCOUNTS, Account, Currency, findThirdPartyOwner, TransferReceipt } from '@/props/account';
import TransferConfirmationModal from '@/components/transferModal/TransferConfirmationModal'; // Lo crearemos en el paso 3

// Tipos para el estado del formulario
type TransferType = 'PROPIAS' | 'TERCEROS';

interface TransferForm {
  sourceAccountId: string;
  targetAccountId: string; // Puede ser un IBAN o número de cuenta de tercero
  amount: number | '';
  currency: Currency;
  description: string;
}

const TransfersPage: React.FC = () => {
  const [transferType, setTransferType] = useState<TransferType>('PROPIAS');
  const [formData, setFormData] = useState<TransferForm>({
    sourceAccountId: '',
    targetAccountId: '',
    amount: '',
    currency: 'CRC', // Default
    description: '',
  });
  const [targetOwner, setTargetOwner] = useState<string | null>(null); // Solo para transferencias a terceros
  const [receipt, setReceipt] = useState<TransferReceipt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const userAccounts = MOCK_ACCOUNTS; // Cuentas propias

  // 1. Obtener los datos de las cuentas seleccionadas
  const sourceAccount = userAccounts.find(a => a.account_id === formData.sourceAccountId);
  const sourceCurrency = sourceAccount?.currency || 'CRC';

  // 2. Filtrar cuentas destino (solo para transferencias propias)
  const availableTargetAccounts = userAccounts.filter(a => a.account_id !== formData.sourceAccountId);

  // 3. Validaciones y habilitación del botón
  const isFormValid = useMemo(() => {
    setValidationError(null);

    // Validaciones básicas: Origen y Monto
    if (!formData.sourceAccountId || !formData.amount || typeof formData.amount !== 'number' || formData.amount <= 0) {
      return false;
    }

    if (transferType === 'PROPIAS') {
      // PROPIAS: Origen != Destino
      if (!formData.targetAccountId || formData.sourceAccountId === formData.targetAccountId) {
        return false;
      }
      const target = userAccounts.find(a => a.account_id === formData.targetAccountId);
      if (!target || target.currency !== sourceCurrency) {
        setValidationError('Error: La moneda de origen y destino deben coincidir.');
        return false;
      }
    } else if (transferType === 'TERCEROS') {
      // TERCEROS: Destino debe tener un owner validado
      if (!formData.targetAccountId) return false;
      if (!targetOwner) return false; // Debe haber validado la cuenta
    }

    // Validación de Saldo
    if (sourceAccount && formData.amount > sourceAccount.balance) {
      setValidationError(`Saldo insuficiente. Disponible: ${sourceAccount.balance.toFixed(2)} ${sourceCurrency}`);
      return false;
    }
    
    return true;
  }, [formData, transferType, sourceAccount, userAccounts, targetOwner, sourceCurrency]);
  
  // Manejador del cambio de input
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || '' : value }));
  };

  // Manejador del cambio de cuenta origen (reinicia destino y moneda si es propia)
  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSourceId = e.target.value;
    const newSource = userAccounts.find(a => a.account_id === newSourceId);
    
    setFormData(prev => ({ 
      ...prev, 
      sourceAccountId: newSourceId, 
      targetAccountId: '', // Reiniciar destino
      currency: newSource?.currency || 'CRC' // Ajustar moneda a origen
    }));
    setTargetOwner(null); // Reiniciar owner de tercero
    setValidationError(null);
  };
  
  // Manejador de la validación de cuenta de terceros
  const handleValidateThirdParty = () => {
    const owner = findThirdPartyOwner(formData.targetAccountId);
    if (owner) {
      setTargetOwner(owner.owner_name);
      setValidationError(null);
    } else {
      setTargetOwner(null);
      setValidationError('La cuenta destino no existe o no pertenece al mismo banco.');
    }
  };

  // 4. Lógica de Continuar (Abre la Modal de Confirmación)
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setIsModalOpen(true);
    }
  };

  // 5. Lógica de Confirmación Final (Simulación de Transferencia)
  const handleConfirmTransfer = async () => {
    setIsSubmitting(true);

    // SIMULACIÓN DE LATENCIA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // SIMULACIÓN DE ÉXITO Y GENERACIÓN DE COMPROBANTE
    const receiptData: TransferReceipt = {
      transactionId: `TX-${Date.now()}`,
      sourceAccount: formData.sourceAccountId,
      targetAccount: formData.targetAccountId,
      targetOwner: transferType === 'PROPIAS' ? (availableTargetAccounts.find(a => a.account_id === formData.targetAccountId)?.alias || 'Cuenta Propia') : targetOwner || 'Tercero',
      amount: formData.amount as number,
      currency: sourceCurrency,
      description: formData.description || 'Transferencia sin descripción',
      timestamp: new Date().toISOString(),
    };
    
    setReceipt(receiptData);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Transferencias</h1>

      {/* 1. Selector de Tipo */}
      <div className="flex bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <button
          onClick={() => { setTransferType('PROPIAS'); setFormData(prev => ({ ...prev, targetAccountId: '' })); setTargetOwner(null); setValidationError(null); }}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            transferType === 'PROPIAS' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Cuentas Propias
        </button>
        <button
          onClick={() => { setTransferType('TERCEROS'); setFormData(prev => ({ ...prev, targetAccountId: '' })); setTargetOwner(null); setValidationError(null); }}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            transferType === 'TERCEROS' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          A Terceros (Mismo Banco)
        </button>
      </div>

      {/* 2. Formulario */}
      <form onSubmit={handleContinue} className="bg-white p-4 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
          {transferType === 'PROPIAS' ? 'Transferencia Interna' : 'Transferencia a Terceros'}
        </h2>
        
        {/* Error General de Validación */}
        {validationError && (
          <div className="p-3 bg-red-100 text-red-700 text-sm rounded-md">
            {validationError}
          </div>
        )}

        {/* Campo Cuenta Origen */}
        <div>
          <label htmlFor="sourceAccountId" className="block text-sm font-medium text-gray-700">Cuenta Origen</label>
          <select
            id="sourceAccountId"
            name="sourceAccountId"
            value={formData.sourceAccountId}
            onChange={handleSourceChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="" disabled>Seleccione cuenta origen</option>
            {userAccounts.map(account => (
              <option key={account.account_id} value={account.account_id}>
                {account.alias} ({account.account_id.slice(-4)}) - {account.currency} {account.balance.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {/* Campo Cuenta Destino (PROPIAS) */}
        {transferType === 'PROPIAS' && (
          <div>
            <label htmlFor="targetAccountId" className="block text-sm font-medium text-gray-700">Cuenta Destino</label>
            <select
              id="targetAccountId"
              name="targetAccountId"
              value={formData.targetAccountId}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="" disabled>Seleccione cuenta destino</option>
              {availableTargetAccounts.map(account => (
                <option key={account.account_id} value={account.account_id}>
                  {account.alias} ({account.account_id.slice(-4)}) - {account.currency}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Campo Cuenta Destino (TERCEROS) */}
        {transferType === 'TERCEROS' && (
          <div>
            <label htmlFor="targetAccountId" className="block text-sm font-medium text-gray-700">Número de Cuenta Destino (Mismo Banco)</label>
            <div className="flex mt-1 space-x-2">
              <input
                type="text"
                id="targetAccountId"
                name="targetAccountId"
                value={formData.targetAccountId}
                onChange={handleChange}
                placeholder="Ej: 12345678901234567890"
                maxLength={20}
                className="flex-1 p-3 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="button"
                onClick={handleValidateThirdParty}
                disabled={!formData.targetAccountId}
                className={`py-3 px-4 rounded-lg text-white font-semibold transition duration-150 ${
                    formData.targetAccountId ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Validar
              </button>
            </div>
            {targetOwner && <p className="mt-2 text-sm text-green-600 font-medium">✅ Titular: {targetOwner}</p>}
          </div>
        )}
        
        {/* Moneda (Auto-seleccionada por origen) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Moneda</label>
          <p className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-lg font-semibold">
            {sourceCurrency}
          </p>
        </div>

        {/* Monto */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto a transferir</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            placeholder="0.00"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-lg font-mono focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={255}
            placeholder="Ej: Pago de alquiler, Regalo"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Botón Continuar */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-3 rounded-lg text-white font-semibold transition duration-150 ${
            isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Continuar
        </button>
      </form>

      {/* 3. Modal de Confirmación y Comprobante */}
      {isModalOpen && (
        <TransferConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmTransfer}
          isSubmitting={isSubmitting}
          formData={{
            ...formData,
            amount: formData.amount as number,
            currency: sourceCurrency,
          }}
          sourceAccount={sourceAccount!}
          targetOwner={targetOwner}
          transferType={transferType}
          receipt={receipt}
        />
      )}
    </div>
  );
};

export default TransfersPage;