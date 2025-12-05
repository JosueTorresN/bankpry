import InputField from '@/components/forms/inputs/inputField';
import Button from '@/components/button/button';
import LoadingSpinner from '@/components/feedBack/loadingSpineer';
import styles from './PinConsultModal.module.css';
import { useTranslations } from 'next-intl';
type Props = {
  otp: string;
  setOtp: (value: string) => void;
  onVerify: () => void;
  isLoading: boolean;
};

export default function OtpInputStep({ otp, setOtp, onVerify, isLoading }: Props) {
  const t = useTranslations('CardDetails'); 
  return (
    <div className={styles.step_container}>
      <input
        type="text"
        id="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        disabled={isLoading}
        maxLength={6}
        placeholder={t('otp_placeholder')}
        className={styles.otp_input}
      />
      <Button onClick={onVerify} disabled={isLoading}>
        {isLoading ? <><LoadingSpinner /> {t('verifying_text')}</> : t('verify_button')}
      </Button>
    </div>
  );
}