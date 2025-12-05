// components/modalConsults/PinConsultModal.tsx
"use client";
import { CreditCard } from '@/lib/types/cards';
import Modal from '@/components/modal/Modal';
import Alert from '@/components/alert/alert';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import OtpInputStep from './OtpInputStep';
import PinDisplayStep from './PinDisplayStep';
import { usePinVerification } from '@/lib/hooks/userPinVerification';

type Props = {
  card: CreditCard;
  isOpen: boolean;
  onClose: () => void;
};

export default function PinConsultModal({ card, isOpen, onClose }: Props) {
  const { 
    step, message, otp, setOtp, 
    seconds, handleVerifyOtp, handleCopyPin,
    revealedPin
  } = usePinVerification(card.id, isOpen, card.pin, onClose);

  // Creamos una versión de la tarjeta con el PIN real para mostrarla
  const cardWithRealPin = { ...card, pin: revealedPin };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Consultar PIN">
      <div style={{ marginBottom: '1rem' }}>
        <Alert 
            message={message} 
            type={step === 'ERROR' ? 'error' : step === 'SHOWING' ? 'success' : 'info'}
        >
            {message}
        </Alert>
      </div>
      
      {step === 'REQUESTING' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
            <LoadingSpinner />
            <p className="mt-2 text-sm text-gray-500">Enviando código OTP...</p>
        </div>
      )}
      
      {(step === 'IDLE' || step === 'VERIFYING' || step === 'ERROR') && (
        <OtpInputStep 
          otp={otp} 
          setOtp={setOtp} 
          onVerify={handleVerifyOtp} 
          isLoading={step === 'VERIFYING'} 
        />
      )}
      
      {step === 'SHOWING' && (
        <PinDisplayStep 
          card={cardWithRealPin}
          seconds={seconds} 
          onCopy={handleCopyPin} 
          onClose={onClose} 
        />
      )}
    </Modal>
  );
}