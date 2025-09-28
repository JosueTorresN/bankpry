import InputField from '@/components/forms/inputs/inputField'; // Asumiendo ruta
import Button from '@/components/button/button';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import styles from './PinConsultModal.module.css';

type Props = {
  otp: string;
  setOtp: (value: string) => void;
  onVerify: () => void;
  isLoading: boolean;
};

export default function OtpInputStep({ otp, setOtp, onVerify, isLoading }: Props) {
  return (
    <div className={styles.step_container}>
      {/* Usamos un InputField reutilizable si lo tenemos, o un input normal */}
      <input
        type="text"
        id="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        disabled={isLoading}
        maxLength={6}
        placeholder="Ej: 123456"
        className={styles.otp_input}
      />
      <Button onClick={onVerify} disabled={isLoading}>
        {isLoading ? <><LoadingSpinner /> Verificando...</> : 'Verificar Código'}
      </Button>
    </div>
  );
}