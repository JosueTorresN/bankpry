'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_ACCOUNTS, MOCK_MOVEMENTS, Account, Movement, MovementType, Currency } from '@/props/account';
import { useParams } from 'next/navigation';

// Helper para formatear moneda (reutilizado)
const formatCurrency = (amount: number, currency: Currency) => {
  const locale = currency === 'CRC' ? 'es-CR' : 'en-US';
  const style = 'currency';
  const currencyCode = currency;

  return new Intl.NumberFormat(locale, { style, currency: currencyCode }).format(amount);
};

// --- Componente: Tarjeta de Movimiento ---
const MovementItem: React.FC<{ movement: Movement }> = ({ movement }) => {
  const isCredit = movement.type === 'CREDITO';
  const sign = isCredit ? '+' : '-';
  const color = isCredit ? 'text-green-600' : 'text-red-600';

  // Formato de fecha a dd/mm/yyyy hh:mm AM/PM
  const formattedDate = new Date(movement.date).toLocaleString('es-CR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {movement.description}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {formattedDate} | {movement.type}
        </p>
      </div>
      <p className={`text-base font-semibold ${color} ml-2`}>
        {sign} {formatCurrency(Math.abs(movement.amount), movement.currency)}
      </p>
    </div>
  );
};

// --- Página: Detalle de Cuenta ---
const AccountDetailPage: React.FC = () => {
  const params = useParams();
  const accountId = params.accountId as string;
  const [filterType, setFilterType] = useState<MovementType | 'TODOS'>('TODOS');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Obtener la cuenta seleccionada
  const account = MOCK_ACCOUNTS.find(a => a.account_id === accountId);
  const allMovements = MOCK_MOVEMENTS.filter(m => m.account_id === accountId);

  // Manejo de estados: Cuenta no encontrada
  if (!account) {
    return (
      <div className="p-4 text-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Detalle de Cuenta</h1>
        <p className="text-lg text-red-500">Cuenta {accountId.slice(-4)} no encontrada.</p>
      </div>
    );
  }

  // 2. Lógica de Filtrado de Movimientos (Optimizada con useMemo)
  const filteredMovements = useMemo(() => {
    let list = allMovements;

    // Filtro por Tipo (Crédito/Débito)
    if (filterType !== 'TODOS') {
      list = list.filter(m => m.type === filterType);
    }

    // Filtro por Búsqueda de Texto (Descripción)
    if (searchText) {
      const lowerCaseSearch = searchText.toLowerCase();
      list = list.filter(m => m.description.toLowerCase().includes(lowerCaseSearch));
    }

    // Ordenar por fecha (más reciente primero)
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  }, [allMovements, filterType, searchText]);

  const currencySymbol = account.currency === 'CRC' ? '₡' : '$';

  // Manejo de estados: Cargando
  if (loading) {
    return (
      <div className="p-4 text-center min-h-screen flex items-center justify-center">
        <p className="text-lg text-blue-600">Cargando movimientos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Encabezado y Saldo (Sticky para Mobile) */}
      <div className="sticky top-0 bg-white p-4 shadow-md z-10">
        <h1 className="text-xl font-bold text-gray-800 mb-1">{account.alias}</h1>
        <p className="text-sm text-gray-500 mb-3">
            {account.type} | {account.account_id}
        </p>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600">Saldo Disponible ({account.currency})</p>
          <p className="text-3xl font-extrabold text-blue-800">
            {formatCurrency(account.balance, account.currency)}
          </p>
        </div>
      </div>

      {/* Área de Filtros (Mobile-First) */}
      <div className="p-4 bg-white border-b border-gray-100">
        <h2 className="text-lg font-semibold mb-3">Filtros de Movimientos</h2>
        
        {/* Input de Búsqueda */}
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Selector de Tipo */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as MovementType | 'TODOS')}
          className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="TODOS">Todos los movimientos</option>
          <option value="CREDITO">Créditos</option>
          <option value="DEBITO">Débitos</option>
        </select>
      </div>
      
      {/* Lista de Movimientos */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Historial</h2>
        
        {/* Manejo de estado: Vacio */}
        {error && (
            <div className="text-center p-6 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">Error de conexión: {error}</p>
            </div>
        )}
        
        {filteredMovements.length === 0 && !error ? (
          <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700">No hay movimientos que coincidan con los filtros.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
            {filteredMovements.map((movement) => (
              <MovementItem key={movement.id} movement={movement} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetailPage;