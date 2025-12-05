// hooks/useCards.ts
"use client";
import { useState, useEffect } from 'react';
import { CreditCard } from '@/lib/types/cards';
import { fetchCards } from '@/services/cards';

const useAuthToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem("TOKEN") : null;
};

export function useCards() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const token = useAuthToken();

  useEffect(() => {
    const loadCards = async () => {
      // 1. Validar Token
      if (!token) {
        setError('No se encontró sesión activa.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 2. Llamada al servicio real
        const data = await fetchCards(token);
        setCards(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching cards:", err);
        setError(err.message || 'No se pudieron cargar las tarjetas.');
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [token]);

  return { cards, loading, error };
}