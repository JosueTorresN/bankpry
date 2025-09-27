// hooks/useCards.ts
"use client";
import { useState, useEffect } from 'react';
import { CreditCard } from '@/lib/types/cards';
import { MOCK_CARDS } from '@/lib/data/cards';

export function useCards() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simula una llamada a una API
    const fetchCards = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula retraso de red
        setCards(MOCK_CARDS);
      } catch (err) {
        setError('No se pudieron cargar las tarjetas.');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return { cards, loading, error };
}