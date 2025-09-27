'use client';

import React, { useState } from 'react';
import { MOCK_ACCOUNTS, Account, Currency } from '@/props/account';
import { useRouter } from 'next/navigation';

// Helper para formatear saldos (mobile-first: usar formatos claros)
const formatCurrency = (amount: number, currency: Currency) => {
  const locale = currency === 'CRC' ? 'es-CR' : 'en-US';
  const style = 'currency';
  const currencyCode = currency;

  return new Intl.NumberFormat(locale, { style, currency: currencyCode }).format(amount);
};

// --- Componente: Tarjeta de Cuenta ---
const AccountCard: React.FC<{ account: Account }> = ({ account }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    // Navegamos a la vista de detalle con el ID de la cuenta en la URL
    router.push(`/dashboard/${account.account_id}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{account.alias}</h2>
          <p className="text-xs text-gray-500">
            {account.type} | {account.account_id.slice(-4)}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          account.currency === 'CRC' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {account.currency}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-500">Saldo Disponible</p>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(account.balance, account.currency)}
        </p>
      </div>

      <button
        onClick={handleViewDetails}
        className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition duration-150"
      >
        Ver detalles
      </button>
    </div>
  );
};

// --- Página del Dashboard ---
const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // En un futuro, aquí se haría un fetch de datos, manejando loading y error.
  const accounts = MOCK_ACCOUNTS; 

  if (loading) {
    return (
      <div className="p-4 text-center min-h-screen flex items-center justify-center">
        <p className="text-lg text-blue-600">Cargando resumen de cuentas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center min-h-screen">
        <p className="text-lg text-red-500">Error al cargar las cuentas: {error}</p>
      </div>
    );
  }
  
  if (accounts.length === 0) {
    return (
      <div className="p-4 text-center min-h-screen">
        <p className="text-lg text-gray-500">No tienes cuentas disponibles.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tus Cuentas</h1>
      <div>
        {accounts.map((account) => (
          <AccountCard key={account.account_id} account={account} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;