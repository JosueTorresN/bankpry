'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_CARDS, MOCK_CARD_MOVEMENTS, CardMovement, CardMovementType, Currency, CreditCard, maskCardNumber } from '@/props/creditCard';
import { useParams } from 'next/navigation';
import PinConsultModal from '@/components/modalConsults/PinConsultModal';
// Helper para formatear moneda (reutilizado)
const formatCurrency = (amount: number, currency: Currency) => {
  const locale = currency === 'CRC' ? 'es-CR' : 'en-US';
  const style = 'currency';
  const currencyCode = currency;
  return new Intl.NumberFormat(locale, { style, currency: currencyCode }).format(amount);
};

// --- Componente: Tarjeta de Movimiento ---
const CardMovementItem: React.FC<{ movement: CardMovement }> = ({ movement }) => {
  const isPayment = movement.type === 'PAGO';
  const color = isPayment ? 'text-green-600' : 'text-red-600';

  // Formato de fecha a dd/mm/yyyy
  const formattedDate = new Date(movement.date).toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
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
        {formatCurrency(movement.amount, movement.currency)}
      </p>
    </div>
  );
};

// --- Página: Detalle de Tarjeta ---
const CardDetailPage: React.FC = () => {
  const params = useParams();
  const cardId = params.cardId as string;
  const [filterType, setFilterType] = useState<CardMovementType | 'TODOS'>('TODOS');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Obtener la tarjeta seleccionada
  const card = MOCK_CARDS.find(c => c.id === cardId);
  const allMovements = MOCK_CARD_MOVEMENTS.filter(m => m.card_id === cardId);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Manejo de estado: Tarjeta no encontrada
  if (!card) {
    return (
      <div className="p-4 text-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Detalle de Tarjeta</h1>
        <p className="text-lg text-red-500">Tarjeta no encontrada.</p>
      </div>
    );
  }

  // 2. Lógica de Filtrado de Movimientos
  const filteredMovements = useMemo(() => {
    let list = allMovements;

    // Filtro por Tipo (Compra/Pago)
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

  const limitAvailable = card.limit - card.currentBalance;

  // Manejo de estado: Cargando
  if (loading) {
    return (
      <div className="p-4 text-center min-h-screen flex items-center justify-center">
        <p className="text-lg text-blue-600">Cargando movimientos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Encabezado y Resumen de Límite */}
      <div className="sticky top-0 bg-white p-4 shadow-md z-10 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 mb-1">{card.type} Card</h1>
        <p className="text-sm text-gray-500 mb-3">
            {maskCardNumber(card.cardNumber)} | {card.holder}
        </p>
        
        {/* Resumen de Saldo */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50 rounded-lg text-center">
          <div>
            <p className="text-xs text-blue-600">Límite Disponible</p>
            <p className="text-lg font-extrabold text-blue-800">
              {formatCurrency(limitAvailable, card.currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-red-600">Consumo Actual</p>
            <p className="text-lg font-extrabold text-red-800">
              {formatCurrency(card.currentBalance, card.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Botón "Consultar PIN" */}
        <button
             onClick={() => setIsPinModalOpen(true)}
             className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
         >
             Consultar PIN
         </button>
       

      {/* Área de Filtros */}
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
          onChange={(e) => setFilterType(e.target.value as CardMovementType | 'TODOS')}
          className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="TODOS">Todos</option>
          <option value="COMPRA">Compras</option>
          <option value="PAGO">Pagos</option>
        </select>
      </div>
      
      {/* Lista de Movimientos */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Transacciones</h2>
        
       {/* 4. Componente Modal de Consulta de PIN el codigo de consulta es 123456 para ambas tarjetas*/}
       {card && (
         <PinConsultModal 
           card={card} 
           isOpen={isPinModalOpen} 
           onClose={() => setIsPinModalOpen(false)} 
         />
       )}

        {/* Manejo de estado: Error */}
        {error && (
            <div className="text-center p-6 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">Error de conexión: {error}</p>
            </div>
        )}
        
        {/* Manejo de estado: Vacio */}
        {filteredMovements.length === 0 && !error ? (
          <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700">No hay movimientos que coincidan con los filtros.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
            {filteredMovements.map((movement) => (
              <CardMovementItem key={movement.id} movement={movement} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetailPage;
