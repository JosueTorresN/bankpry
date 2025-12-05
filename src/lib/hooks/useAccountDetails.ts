// hooks/useAccountDetails.ts 
"use client";
import { useState, useEffect } from 'react';
import { Account, Movement } from '@/lib/types/accounts'; 
import { fetchAccountById } from '@/services/accountByID'; 
import { fetchAccountMovements } from '@/services/movements'; 

const useAuthToken = () => {
  return localStorage.getItem("TOKEN");
};

export function useAccountDetails(accountId: string | undefined) {
  const [account, setAccount] = useState<Account | null>(null);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authToken = useAuthToken();

  useEffect(() => {
    if (!accountId) {
      setError('ID de cuenta no proporcionado.');
      setLoading(false);
      return;
    }
    
    if (!authToken) {
        setError('No se pudo obtener el token de autenticación.');
        setLoading(false);
        return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [fetchedAccount, fetchedMovements] = await Promise.all([
            fetchAccountById(accountId, authToken),
            fetchAccountMovements(accountId, authToken)
        ]);

        if (!fetchedAccount) {
          throw new Error('La cuenta no fue encontrada.');
        }

        const sortedMovements = fetchedMovements.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setAccount(fetchedAccount);
        setMovements(sortedMovements);
        
      } catch (err: any) {
        console.error("Error fetching details:", err);
        setError(err.message || 'Error al cargar los detalles de la cuenta.');
        setAccount(null);
        setMovements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, authToken]);

  return { account, movements, loading, error };
}

// "use client";
// import { useState, useEffect } from 'react';
// import { Account, Movement } from '@/lib/types/accounts'; 
// import { MOCK_MOVEMENTS } from '@/lib/data/accounts'; // Mantenemos MOCK_MOVEMENTS
// import { fetchAccountById } from '@/services/accountByID'; // Importa el nuevo servicio


// const useAuthToken = () => {
//     return localStorage.getItem("TOKEN");
  
// };

// export function useAccountDetails(accountId: string | undefined) {
//   const [account, setAccount] = useState<Account | null>(null);
//   const [movements, setMovements] = useState<Movement[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const authToken = useAuthToken(); // Obtener el token de autenticación

//   useEffect(() => {
//     if (!accountId) {
//       setError('ID de cuenta no proporcionado.');
//       setLoading(false);
//       return;
//     }
    
//     // Asegurarse de que tenemos un token antes de intentar cargar
//     if (!authToken) {
//         setError('No se pudo obtener el token de autenticación.');
//         setLoading(false);
//         return;
//     }


//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         // await new Promise(resolve => setTimeout(resolve, 500)); // Simula red

//         // --- NUEVO CÓDIGO para la cuenta ---
        
//         const foundAccount = await fetchAccountById(accountId, authToken);
//         console.log("identificador >>>>"+accountId);
//         // --- FIN NUEVO CÓDIGO ---

//         if (!foundAccount) {
//           throw new Error('La cuenta no fue encontrada.');
//         }

//         // --- Mantenemos el MOCK para movimientos por ahora ---
//         const accountMovements = MOCK_MOVEMENTS
//           .filter(m => m.account_id === accountId)
//           .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//         // ----------------------------------------------------

//         setAccount(foundAccount);
//         setMovements(accountMovements);
//         setError(null);
        
//       } catch (err: any) {
//         // Captura el error lanzado por fetchAccountById
//         setError(err.message); 
//         setAccount(null); // Asegura que la cuenta sea nula en caso de error
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [accountId, authToken]);

//   return { account, movements, loading, error };
// }