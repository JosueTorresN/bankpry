// Tipos de datos para el módulo de Cuentas y Movimientos

export type Currency = 'CRC' | 'USD';
export type AccountType = 'Ahorro' | 'Corriente';
export type MovementType = 'CREDITO' | 'DEBITO';

// --- Tipos de Cuentas ---
export interface Account {
  id: string;
  account_id: string; // Formato IBAN: CR01-{4 banco}-{4 sucursal}-{12 cuenta}
  alias: string;      // Nombre amigable
  type: AccountType;  // Ahorro | Corriente
  currency: Currency; // CRC | USD
  balance: number;    // Saldo disponible (2 decimales)
  owner_id: string;   // customer_id del usuario
}

export interface ThirdPartyAccount {
  account_id: string; // Número de cuenta completo
  owner_name: string;
  bank_name: string;
}


// --- Tipos de Movimientos ---
export interface Movement {
  id: string;            // ID de transacción
  account_id: string;    // Cuenta asociada
  date: string;          // ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
  type: MovementType;    // CREDITO | DEBITO
  description: string;   // Texto corto
  currency: Currency;    // CRC | USD
  amount: number;        // Monto del movimiento (2 decimales)
}

export interface TransferReceipt {
  transactionId: string;
  sourceAccount: string;
  targetAccount: string;
  targetOwner: string;
  amount: number;
  currency: Currency;
  description: string;
  timestamp: string; // Fecha y hora de la operación
}

export interface AccountsApiResponse {
  success: boolean;
  timestamp: string;
  path: string;
  data: Array<{
    id: string;
    usuario_id: string;
    iban: string;
    alias: string;
    tipocuenta: string; 
    moneda: string;     
    saldo: string;      
    estado: string;
    fecha_creacion: string;
  }>;
}

// Define la estructura de datos de la cuenta que viene de la API
export interface ApiAccountData {
    id: string;
    usuario_id: string;
    iban: string;
    alias: string;
    tipocuenta: string; // ID o string
    moneda: string;     // ID o string
    saldo: string;      // Viene como string "0.00"
    estado: string;
    fecha_creacion: string;
}

// Define la estructura de la respuesta para una sola cuenta
export interface AccountDetailApiResponse {
    success: boolean;
    timestamp: string;
    path: string;
    data: ApiAccountData;
}