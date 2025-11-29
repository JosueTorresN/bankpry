
"use client";
import { useState, useEffect } from 'react';
import { Account } from '@/lib/types/accounts';

import { fetchAccounts } from '@/services/accounts'; 


const useAuthToken = () => {

    return localStorage.getItem("TOKEN");
    
};

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authToken = useAuthToken(); 

  useEffect(() => {
    if (!authToken) {
        setError('No se pudo obtener el token de autenticación.');
        setLoading(false);
        return;
    }

    const loadAccounts = async () => {
      try {
        setLoading(true);
 
        const fetchedAccounts = await fetchAccounts(authToken);
       

        setAccounts(fetchedAccounts);
        setError(null);

      } catch (err: any) {
        
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, [authToken]); 

  return { accounts, loading, error };
}