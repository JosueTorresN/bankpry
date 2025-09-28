// hooks/useAccountDetails.ts
"use client";
import { useState, useEffect } from 'react';
import { Account, Movement } from '@/lib/types/accounts'; // Asumiendo que ya tienes estos tipos
import { MOCK_ACCOUNTS, MOCK_MOVEMENTS } from '@/lib/data/accounts'; // Asumiendo que ya tienes estos datos

export function useAccountDetails(accountId: string | undefined) {
  const [account, setAccount] = useState<Account | null>(null);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) {
      setError('ID de cuenta no proporcionado.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula red
        
        const foundAccount = MOCK_ACCOUNTS.find(a => a.account_id === accountId);
        if (!foundAccount) {
          throw new Error('La cuenta no fue encontrada.');
        }

        const accountMovements = MOCK_MOVEMENTS
          .filter(m => m.account_id === accountId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setAccount(foundAccount);
        setMovements(accountMovements);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId]);

  return { account, movements, loading, error };
}