// components/common/Navbar.tsx
"use client";

import {Link} from '@/i18n/routing';
import styles from './Header.module.css';
import { useTranslations } from 'next-intl'; 
type Props = {
  isOpen: boolean;
  onLinkClick?: () => void;
};



export default function Navbar({ isOpen, onLinkClick }: Props) {
  const t = useTranslations('Navigation');
  const navLinks = [
  { href: '/dashboard', label:  t('nav_accounts') },
  { href: '/cards', label: t('nav_cards') },
  { href: '/transfers', label: t('nav_transfers') },
];
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