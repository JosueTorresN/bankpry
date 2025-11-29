// hooks/useAccounts.ts
"use client";
import { useState, useEffect } from 'react';
import { Account } from '@/lib/types/accounts';
import { MOCK_ACCOUNTS } from '@/lib/data/accounts';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simula carga
        setAccounts(MOCK_ACCOUNTS);
      } catch (err) {
        setError('No se pudieron cargar las cuentas.');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  return { accounts, loading, error };
}
