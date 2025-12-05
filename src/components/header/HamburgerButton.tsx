import styles from './Header.module.css';

type Props = {
  isOpen: boolean;
  onClick: () => void;
};

export default function HamburgerButton({ isOpen, onClick }: Props) {
  return (
    <button 
      className={`${styles.hamburger} ${isOpen ? styles.hamburger_open : ''}`} 
      onClick={onClick}
      aria-label="Menú de navegación"
      aria-expanded={isOpen}
      aria-controls="navbar"
    >
      <div className={styles.hamburger_bar}></div>
      <div className={styles.hamburger_bar}></div>
      <div className={styles.hamburger_bar}></div>
    </button>
  );
}