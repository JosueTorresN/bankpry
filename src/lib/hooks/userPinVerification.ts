"use client";
import { useState, useEffect, useCallback } from 'react';

type ModalState = 'IDLE' | 'VERIFYING' | 'ERROR' | 'SHOWING';
const PIN_VISIBILITY_DURATION = 10;
const VALID_OTP = '123456'; // OTP de prueba

export function usePinVerification(isOpen: boolean, cardPin: string, onClose: () => void) {
  const [step, setStep] = useState<ModalState>('IDLE');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [seconds, setSeconds] = useState(PIN_VISIBILITY_DURATION);

  // Resetea el estado cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setStep('IDLE');
      setOtp('');
      setMessage('Ingrese el código de verificación enviado a su correo/SMS.');
      setSeconds(PIN_VISIBILITY_DURATION);
    }
  }, [isOpen]);

  // Lógica del temporizador
  useEffect(() => {
    if (step === 'SHOWING' && seconds > 0) {
      const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (seconds === 0 && step === 'SHOWING') {
      onClose();
    }
  }, [step, seconds, onClose]);

  const handleVerifyOtp = useCallback(async () => {
    if (!otp) {
      setStep('ERROR');
      setMessage('Debe ingresar un código.');
      return;
    }
    setStep('VERIFYING');
    setMessage('Validando código...');
    await new Promise(r => setTimeout(r, 1500)); // Simula red
    
    if (otp === VALID_OTP) {
      setStep('SHOWING');
      setMessage('PIN generado. Se ocultará en breve.');
    } else {
      setStep('ERROR');
      setMessage('El código no es válido o ha expirado.');
    }
  }, [otp]);

  const handleCopyPin = useCallback(() => {
    navigator.clipboard.writeText(cardPin);
    setMessage('PIN copiado al portapapeles.');
  }, [cardPin]);

  return { step, message, otp, setOtp, seconds, handleVerifyOtp, handleCopyPin };
}