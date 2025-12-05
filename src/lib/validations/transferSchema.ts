// lib/validations/transferSchema.ts
import { z } from 'zod';
import { formatCurrency } from '@/lib/data/accounts';
import { Account } from '@/lib/types/accounts'; // Asegúrate de importar tu tipo Account real

// NOTA: Hemos eliminado la importación de MOCK_ACCOUNTS

export const createTransferSchema = (accounts: Account[]) => {
  return z.object({
    transferType: z.enum(['PROPIAS', 'TERCEROS']),
    sourceAccountId: z.string().min(1, 'Debe seleccionar una cuenta de origen.'),
    targetAccountId: z.string().min(1, 'La cuenta de destino es requerida.'),
    amount: z.number({ message: 'El monto es requerido.' }).positive('El monto debe ser mayor a cero.'),
    description: z.string().max(100, 'La descripción no puede exceder los 100 caracteres.').optional(),
    targetOwner: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // AQUI ESTÁ LA CLAVE: Buscamos en el array 'accounts' que pasamos como argumento
    // Asegúrate si tu propiedad es 'id' o 'account_id' según tu interfaz Account
    const sourceAccount = accounts.find(a => a.id === data.sourceAccountId || a.account_id === data.sourceAccountId);
    
    if (!sourceAccount) return;

    // Validación de Saldo Dinámica
    if (data.amount > sourceAccount.balance) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Saldo insuficiente. Disponible: ${formatCurrency(sourceAccount.balance, sourceAccount.currency)}`,
        path: ['amount'],
      });
    }

    // Lógica para transferencias PROPIAS
    if (data.transferType === 'PROPIAS') {
      const targetAccount = accounts.find(a => a.id === data.targetAccountId || a.account_id === data.targetAccountId);
      
      if (!targetAccount) return;
      
      if (sourceAccount.currency !== targetAccount.currency) {
        ctx.addIssue({ 
            code: z.ZodIssueCode.custom, 
            message: 'Las cuentas deben ser de la misma moneda.', 
            path: ['targetAccountId']
        });
      }
    }

    // Lógica para transferencias a TERCEROS
    if (data.transferType === 'TERCEROS') {
      if (!data.targetOwner) {
        ctx.addIssue({ 
            code: z.ZodIssueCode.custom, 
            message: 'Debe validar la cuenta de destino.', 
            path: ['targetAccountId']
        });
      }
    }
  });
};

export type TransferFormValues = z.infer<ReturnType<typeof createTransferSchema>>;