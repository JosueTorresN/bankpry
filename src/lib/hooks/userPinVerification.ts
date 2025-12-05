// lib/hooks/userPinVerification.ts
"use client";
import { useState, useEffect, useCallback } from 'react';
import { requestCardOtp, verifyCardOtp } from '@/services/cards';

type ModalState = 'IDLE' | 'REQUESTING' | 'VERIFYING' | 'ERROR' | 'SHOWING';
const PIN_VISIBILITY_DURATION = 10;

const useAuthToken = () => typeof window !== 'undefined' ? localStorage.getItem("TOKEN") : null;

export function usePinVerification(cardId: string, isOpen: boolean, initialPin: string, onClose: () => void) {
  const [step, setStep] = useState<ModalState>('IDLE');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [seconds, setSeconds] = useState(PIN_VISIBILITY_DURATION);
  
  const [revealedPin, setRevealedPin] = useState(initialPin);
  
  const token = useAuthToken();

  useEffect(() => {
    if (isOpen && cardId) {
      const sendOtp = async () => {
        if (!token) {
            setStep('ERROR');
            setMessage('Sesión no válida.');
            return;
        }

        setStep('REQUESTING');
        setOtp('');
        setRevealedPin(initialPin);
        setMessage('Solicitando código de seguridad...');
        setSeconds(PIN_VISIBILITY_DURATION);

        try {
            const apiMessage = await requestCardOtp(cardId, token);
            setStep('IDLE');
            setMessage(apiMessage || 'Ingrese el código enviado a su dispositivo.');
        } catch (err: any) {
            setStep('ERROR');
            setMessage(err.message || 'Error al enviar OTP.');
        }
      };
      sendOtp();
    }
  }, [isOpen, cardId, token, initialPin]);

  // 2. Timer (Sin cambios)
  useEffect(() => {
    if (step === 'SHOWING' && seconds > 0) {
      const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (seconds === 0 && step === 'SHOWING') {
      onClose();
    }
  }, [step, seconds, onClose]);

  // 3. Validar OTP
  const handleVerifyOtp = useCallback(async () => {
    if (!otp || !token) {
      setStep('ERROR');
      setMessage('Código o sesión inválidos.');
      return;
    }
    
    setStep('VERIFYING');
    setMessage('Verificando código...');
    
    try {
        const sensitiveData = await verifyCardOtp(cardId, otp, token);
      
        setRevealedPin(sensitiveData.pin);
        setStep('SHOWING');
        setMessage(sensitiveData.message || 'Identidad confirmada.');
        
    } catch (err: any) {
        setStep('ERROR');
        setMessage(err.message || 'Código incorrecto. Intente de nuevo.');
    }
  }, [otp, cardId, token]);

  const handleCopyPin = useCallback(() => {
    navigator.clipboard.writeText(revealedPin);
    setMessage('PIN copiado.');
  }, [revealedPin]);

  return { step, message, otp, setOtp, seconds, handleVerifyOtp, handleCopyPin, revealedPin };
}