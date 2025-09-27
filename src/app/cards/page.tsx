'use client';

import React, { useState } from 'react';
import { MOCK_CARDS, CreditCard, Currency, CardType, maskCardNumber } from '@/props/creditCard';
import { useRouter } from 'next/navigation';

// Helper para formatear saldos (reutilizado)
const formatCurrency = (amount: number, currency: Currency) => {
  const locale = currency === 'CRC' ? 'es-CR' : 'en-US';
  const style = 'currency';
  const currencyCode = currency;
  return new Intl.NumberFormat(locale, { style, currency: currencyCode }).format(amount);
};

// Define los estilos de color según el tipo de tarjeta
const getCardStyles = (type: CardType) => {
  switch (type) {
    case 'Black':
      return 'bg-gray-800 text-white shadow-xl shadow-gray-700/50';
    case 'Platinum':
      return 'bg-gradient-to-tr from-gray-400 to-gray-200 text-gray-900 shadow-xl shadow-gray-400/50';
    case 'Gold':
    default:
      return 'bg-gradient-to-tr from-yellow-500 to-yellow-300 text-gray-900 shadow-xl shadow-yellow-500/50';
  }
};

// --- Componente: Tarjeta de Crédito Visual ---
const CreditCardItem: React.FC<{ card: CreditCard }> = ({ card }) => {
  const router = useRouter();
  const cardStyle = getCardStyles(card.type);
  const isDark = card.type === 'Black';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const buttonClass = isDark ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white';

  const limitUsed = (card.currentBalance / card.limit) * 100;

  const handleViewDetails = () => {
    // Navegamos a la vista de detalle
    router.push(`/cards/${card.id}`);
  };

  return (
    <div className="flex-shrink-0 w-full snap-center md:w-80">
      <div className={`${cardStyle} p-5 rounded-xl h-60 flex flex-col justify-between transition transform hover:scale-[1.02] cursor-pointer`}>
        
        {/* Encabezado y Tipo */}
        <div className="flex justify-between items-start">
          <p className={`text-xl font-bold ${textColor}`}>{card.type}</p>
          <p className={`text-sm font-light opacity-80 ${textColor}`}>{card.currency}</p>
        </div>

        {/* Número y Vencimiento */}
        <div className="space-y-3">
          <p className={`text-xl font-mono tracking-wider ${textColor}`}>
            {maskCardNumber(card.cardNumber)}
          </p>
          <div className="flex justify-between items-center text-xs opacity-90">
            <div className="flex flex-col">
              <span className={`uppercase font-light ${textColor}`}>Vence</span>
              <span className={`font-medium ${textColor}`}>{card.exp}</span>
            </div>
            <span className={`uppercase font-semibold ${textColor}`}>{card.holder}</span>
          </div>
        </div>
      </div>
      
      {/* Resumen de uso y botón (Fuera de la tarjeta para Mobile-First) */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-1">
          Consumido: {formatCurrency(card.currentBalance, card.currency)}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${Math.min(limitUsed, 100)}%` }}></div>
        </div>
        <p className="text-xs text-gray-500">Límite Total: {formatCurrency(card.limit, card.currency)}</p>
        <button
          onClick={handleViewDetails}
          className={`w-full mt-3 py-2 text-sm font-medium rounded-md transition ${buttonClass}`}
        >
          Ver Movimientos
        </button>
      </div>
    </div>
  );
};

// --- Página del Dashboard de Tarjetas ---
const CardsDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cards = MOCK_CARDS;

  if (loading) {
    return (
      <div className="p-4 text-center min-h-screen flex items-center justify-center">
        <p className="text-lg text-blue-600">Cargando tarjetas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center min-h-screen">
        <p className="text-lg text-red-500">Error al cargar las tarjetas: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tus Tarjetas de Crédito</h1>
      
      {cards.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-500">No tienes tarjetas de crédito asociadas.</p>
        </div>
      ) : (
        // Carrusel/Grilla para Mobile (usa overflow-x-scroll y snap-x)
        <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory">
          {cards.map((card) => (
            <CreditCardItem key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardsDashboardPage;