"use client";
import { CreditCard } from '@/lib/types/cards';
import Modal from '@/components/modal/Modal';
import Alert from '@/components/alert/alert';
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
    seconds, handleVerifyOtp, handleCopyPin 
  } = usePinVerification(isOpen, card.pin, onClose);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Consultar PIN">
      {/* El mensaje se muestra en todos los pasos */}
      <Alert 
        message={message} 
        type={step === 'ERROR' ? 'error' : step === 'SHOWING' ? 'success' : 'info'}
      >
        {message}
      </Alert>
      
      {/* Renderiza el componente del paso actual */}
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
          card={card} 
          seconds={seconds} 
          onCopy={handleCopyPin} 
          onClose={onClose} 
        />
      )}
    </Modal>
  );
}