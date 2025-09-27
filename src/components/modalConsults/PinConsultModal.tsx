'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, maskCardNumber } from '@/props/creditCard';

// Duración de la visualización del PIN en segundos
const PIN_VISIBILITY_DURATION = 10; // Entre 8 y 12 segundos

interface PinConsultModalProps {
  card: CreditCard;
  isOpen: boolean;
  onClose: () => void;
}

// Estados de la Modal
type ModalState = 'IDLE' | 'STEP_1_VERIFYING' | 'STEP_1_ERROR' | 'STEP_2_CONFIRMING' | 'STEP_2_SHOWING';

const PinConsultModal: React.FC<PinConsultModalProps> = ({ card, isOpen, onClose }) => {
  const [step, setStep] = useState<ModalState>('IDLE');
  const [otpInput, setOtpInput] = useState('');
  const [message, setMessage] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(PIN_VISIBILITY_DURATION);

  // Reiniciar el estado cada vez que se abre la modal
  useEffect(() => {
    if (isOpen) {
      setStep('IDLE');
      setOtpInput('');
      setMessage('Ingrese el código de verificación enviado a su correo/SMS.');
      setSecondsRemaining(PIN_VISIBILITY_DURATION);
    }
  }, [isOpen]);
  
  // Lógica del Temporizador para ocultar el PIN
  useEffect(() => {
    if (step === 'STEP_2_SHOWING' && secondsRemaining > 0) {
      const timer = setTimeout(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    // Auto-ocultar y cerrar la modal al terminar el tiempo
    if (secondsRemaining === 0 && step === 'STEP_2_SHOWING') {
      setMessage('PIN oculto por seguridad.');
      // Opcional: Cerrar la modal automáticamente después de un breve retraso
      const closeTimer = setTimeout(onClose, 500); 
      return () => clearTimeout(closeTimer);
    }
  }, [step, secondsRemaining, onClose]);


  // Paso 1: Simulación de Envío y Verificación de OTP
  const handleVerifyOtp = async () => {
    if (!otpInput) {
      setMessage('Debe ingresar un código.');
      setStep('STEP_1_ERROR');
      return;
    }

    setStep('STEP_1_VERIFYING'); // Estado: Loading
    setMessage('Validando código...');
    
    // SIMULACIÓN DE LATENCIA DE RED
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // SIMULACIÓN DE VERIFICACIÓN: OTP "123456" es válido
    if (otpInput === '123456') {
      setStep('STEP_2_SHOWING'); // Pasa al éxito
      setMessage('PIN generado. Se ocultará en breve.');
      setSecondsRemaining(PIN_VISIBILITY_DURATION);
    } else {
      setStep('STEP_1_ERROR'); // Vuelve al error
      setMessage('El código no es válido o ha expirado.');
    }
  };

  const handleCopyPin = useCallback(() => {
    navigator.clipboard.writeText(card.pin);
    setMessage('PIN copiado al portapapeles.');
    // Mantiene el estado de STEP_2_SHOWING
  }, [card.pin]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm transition-transform duration-300 transform scale-100">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">Consultar PIN</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>

        {/* Mensajes de estado */}
        <p className={`text-sm mb-4 font-medium ${
          step.includes('ERROR') ? 'text-red-500' : step.includes('VERIFYING') ? 'text-blue-500' : 'text-gray-700'
        }`}>
          {message}
        </p>

        {/* PASO 1: Verificación de Identidad (OTP) */}
        {(step === 'IDLE' || step.includes('STEP_1')) && (
          <div className="space-y-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Código de Verificación
            </label>
            <input
              type="text"
              id="otp"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              disabled={step === 'STEP_1_VERIFYING'}
              maxLength={6}
              placeholder="Ej: 123456"
              className="w-full p-3 border border-gray-300 rounded-lg text-center text-xl font-mono tracking-widest focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={step === 'STEP_1_VERIFYING'}
              className={`w-full py-3 rounded-lg text-white font-semibold transition duration-150 ${
                step === 'STEP_1_VERIFYING'
                  ? 'bg-blue-400 cursor-not-allowed flex items-center justify-center'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {step === 'STEP_1_VERIFYING' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Verificando...
                </>
              ) : (
                'Verificar Código'
              )}
            </button>
          </div>
        )}

        {/* PASO 2: Confirmación y PIN mostrado */}
        {step === 'STEP_2_SHOWING' && (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-700 mb-1">
                    PIN (Se oculta en {secondsRemaining}s)
                </p>
                <div className="flex justify-center items-center space-x-4">
                    <p className="text-4xl font-extrabold text-green-800 font-mono">
                        {card.pin}
                    </p>
                    <button onClick={handleCopyPin} className="text-gray-500 hover:text-blue-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v4m-4 5h4m-4 4h4m-4 4h4m-4-12h4m-4-4h4" />
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Resumen de la tarjeta */}
            <div className="text-left text-sm p-3 bg-gray-50 rounded-md">
                <p><strong>Tipo:</strong> {card.type}</p>
                <p><strong>Número:</strong> {maskCardNumber(card.cardNumber)}</p>
                <p><strong>CVV:</strong> {card.cvv}</p>
            </div>
            
            <button
                onClick={onClose}
                className="w-full py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
            >
                Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PinConsultModal;