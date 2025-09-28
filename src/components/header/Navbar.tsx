import Link from 'next/link';
import styles from './Header.module.css';

type Props = {
  isOpen: boolean;
  onLinkClick?: () => void; // Para cerrar el menú en móvil al hacer clic
};

const navLinks = [
  { href: '/dashboard', label: 'Cuentas' },
  { href: '/cards', label: 'Tarjetas' },
  { href: '/transfers', label: 'Transferencias' },
];

export default function Navbar({ isOpen, onLinkClick }: Props) {
  return (
    <nav 
      id="navbar"
      className={`${styles.navbar} ${isOpen ? styles.navbar_open : ''}`}
    >
      <ul className={styles.nav_list}>
        {navLinks.map(link => (
          <li key={link.href}>
            <Link href={link.href} className={styles.nav_link} onClick={onLinkClick}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}