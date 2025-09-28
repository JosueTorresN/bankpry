"use client";
import { useState, useEffect } from 'react';
import { CreditCard, CardMovement } from '@/lib/types/cards';
import { MOCK_CARDS, MOCK_CARD_MOVEMENTS } from '@/lib/data/cards';

export function useCardDetails(cardId: string | undefined) {
  const [card, setCard] = useState<CreditCard | null>(null);
  const [movements, setMovements] = useState<CardMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) {
      setError('ID de tarjeta no proporcionado.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula red
        
        const foundCard = MOCK_CARDS.find(c => c.id === cardId);
        if (!foundCard) {
          throw new Error('Tarjeta no encontrada.');
        }

        const cardMovements = MOCK_CARD_MOVEMENTS
          .filter(m => m.card_id === cardId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setCard(foundCard);
        setMovements(cardMovements);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cardId]);

  return { card, movements, loading, error };
}