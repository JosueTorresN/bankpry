export default interface CardProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export default interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}