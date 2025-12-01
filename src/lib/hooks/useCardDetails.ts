// hooks/useCardDetails.ts
"use client";
import { useState, useEffect } from 'react';
import { CreditCard, CardMovement } from '@/lib/types/cards';
import { fetchCardById, fetchCardMovements } from '@/services/cards';

const useAuthToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem("TOKEN") : null;
};

export function useCardDetails(cardId: string) {
    const [card, setCard] = useState<CreditCard | null>(null);
    const [movements, setMovements] = useState<CardMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const token = useAuthToken();

    useEffect(() => {
        if (!cardId || !token) return;

        const loadData = async () => {
            setLoading(true);
            try {
                // Ejecutamos ambas peticiones en paralelo
                const [cardData, movementsData] = await Promise.all([
                    fetchCardById(cardId, token),
                    fetchCardMovements(cardId, token)
                ]);

                setCard(cardData);
                
                // Ordenar por fecha descendente (más reciente primero)
                const sortedMovements = movementsData.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setMovements(sortedMovements);
                
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Error cargando detalles de la tarjeta');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [cardId, token]);

    return { card, movements, loading, error };
}