import { z } from 'zod';
import { MOCK_ACCOUNTS, formatCurrency } from '@/lib/data/accounts';

export const transferSchema = z.object({
  transferType: z.enum(['PROPIAS', 'TERCEROS']),
  sourceAccountId: z.string().min(1, 'Debe seleccionar una cuenta de origen.'),
  targetAccountId: z.string().min(1, 'La cuenta de destino es requerida.'),
  amount: z.number({ message: 'El monto es requerido.' }).positive('El monto debe ser mayor a cero.'),
  description: z.string().max(100, 'La descripción no puede exceder los 100 caracteres.').optional(),
  targetOwner: z.string().optional(), // Se llena al validar la cuenta de tercero
})
.superRefine((data, ctx) => {
  const sourceAccount = MOCK_ACCOUNTS.find(a => a.account_id === data.sourceAccountId);
  if (!sourceAccount) return;

  // Validación de Saldo
  if (data.amount > sourceAccount.balance) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Saldo insuficiente. Disponible: ${formatCurrency(sourceAccount.balance, sourceAccount.currency)}`,
      path: ['amount'],
    });
  }

  // Lógica para transferencias PROPIAS
  if (data.transferType === 'PROPIAS') {
    const targetAccount = MOCK_ACCOUNTS.find(a => a.account_id === data.targetAccountId);
    if (!targetAccount) return; // Zod ya valida que no esté vacío, pero es buena práctica
    if (sourceAccount.currency !== targetAccount.currency) {
      ctx.addIssue({ code: 'custom', message: 'Las cuentas deben ser de la misma moneda.', path: ['targetAccountId']});
    }
  }

  // Lógica para transferencias a TERCEROS
  if (data.transferType === 'TERCEROS') {
    if (!data.targetOwner) {
      ctx.addIssue({ code: 'custom', message: 'Debe validar la cuenta de destino.', path: ['targetAccountId']});
    }
  }
});

export type TransferFormValues = z.infer<typeof transferSchema>;